---
title: "Implementing High-Performance Hierarchical Structures in Redis with Go"
description: "Technical deep dive into redigo-tree: atomic tree operations via Lua scripting, O(log n) path traversal, and distributed hierarchical data management in Redis."
pubDate: 2026-03-14
tags: ["redis", "go", "distributed-systems", "data-structures", "redigo-tree"]
draft: false
projectSchema:
  name: "redigo-tree"
  description: "A robust tree structure implementation for Redis in Golang using Lua scripting for atomic operations"
  programmingLanguage: "Go"
  codeRepository: "https://github.com/zhujiaqi/redigo-tree"
  keywords: ["Redis", "Go", "Tree Data Structure", "Distributed Systems", "Hierarchical Data", "Redigo", "Lua Scripting"]
  runtimePlatform: "Redis"
---

## The Challenge: Trees in Key-Value Stores

Redis is fundamentally a key-value store—excellent for O(1) lookups, but notoriously awkward for hierarchical data. Traditional relational databases handle trees with foreign keys and JOINs. Document stores use embedded arrays. But Redis? You're working with strings, hashes, sets, and sorted sets. No native tree primitive exists.

The core problem: **how do you maintain tree consistency when every operation spans multiple keys?**

## Enter redigo-tree

I recently ported the ioredis-tree pattern to Go, creating [`redigo-tree`](https://github.com/zhujiaqi/redigo-tree)—a library that implements atomic tree operations on Redis using **Lua scripting** and **messagepack serialization**. The result: O(1) sibling insertions, O(log n) path traversal, and guaranteed atomicity without distributed locks.

## Architecture: Mapping Trees to Redis Primitives

### Data Model

The core insight is representing each node as two Redis structures:

```
{tree_name}::{node_id}        → Node data (messagepack encoded)
{tree_name}::{node_id}::P     → Parent references (Redis Set)
```

**Node Storage**: Each node is serialized as a messagepack-encoded array containing:
- `node_id`: Unique identifier
- `hasChild`: Boolean flag for quick subtree detection
- `children`: Nested array of child metadata (node_id, hasChild, recursive children)

**Parent Index**: A Redis Set storing all parent nodes for a given node, enabling efficient upward traversal (the `TParents` operation).

### Why Lua Scripts?

Here's where it gets interesting. Redis executes Lua scripts **atomically**—the entire script runs as a single command without interruption. This eliminates race conditions without requiring explicit distributed locks.

```lua
-- Simplified TInsert Lua script structure
local key = tree_name .. '::' .. node_id
local parent_key = tree_name .. '::' .. parent_id

-- Atomic insertion logic
redis.call('SET', key, cmsgpack.pack(node_data))
redis.call('SADD', parent_key .. '::P', parent_id)
```

All tree operations are implemented as pre-loaded Lua scripts:

| Operation | Purpose | Complexity |
|-----------|---------|------------|
| `TInsert` | Insert node as child (with optional position) | O(1)* |
| `TChildren` | Retrieve children with depth limit | O(n) |
| `TParents` | Traverse upward to ancestors | O(log n) |
| `TPath` | Get complete path between nodes | O(log n) |
| `Trem` | Remove specific child from parent | O(n) |
| `TDestroy` | Recursively delete node and descendants | O(n) |
| `TExists` | Check node existence | O(1) |
| `TRename` | Rename a node | O(1) |
| `TPrune` | Remove all children from node | O(n) |
| `TMoveChildren` | Move children between nodes | O(n) |

*Amortized; depends on sibling count

### Atomicity Without Locks

This is the critical design decision. By leveraging Redis's **single-threaded execution model**, every Lua script runs to completion before the next command executes. This guarantees:

1. **Atomicity**: No partial writes—operations complete fully or not at all
2. **Consistency**: Tree structure remains valid after each operation
3. **Isolation**: Concurrent operations don't interfere (Redis queues them)
4. **No Distributed Locks**: The single-threaded model provides natural locking

Compare this to a naive implementation using individual Redis commands:

```go
// NAIVE - Race condition prone
redis.Set(nodeKey, data)
redis.SAdd(parentKey, nodeId)  // ⚠️ What if another client modifies between calls?
```

With Lua scripts:

```go
// ATOMIC - Single command execution
redis.Do("EVALSHA", insertScriptHash, 2, nodeKey, parentKey, serializedData)
```

## Implementation Details: Path Enumeration vs Adjacency List

Two common patterns for tree storage in key-value stores:

**Adjacency List**: Each node stores only its immediate parent. Simple, but expensive for deep traversals (requires multiple round-trips).

**Path Enumeration**: Each node stores its full path (e.g., `/root/parent/child`). Fast queries, but expensive updates (moving a subtree requires updating all descendants).

**redigo-tree uses a hybrid approach**:
- Nodes store immediate parent references (adjacency)
- Parent Sets enable efficient upward traversal without multiple round-trips
- Children are cached in the node data for fast downward reads
- Lua scripts handle multi-step operations atomically

The result: `TParents` (getting all ancestors) runs in O(log n) with a single script execution, not O(n) round-trips.

## Performance Benchmarks

Benchmarks run on Apple M4 with local Redis:

### Insert Operations

| Benchmark | Operations | Time/Op | Memory | Allocations |
|-----------|------------|---------|--------|-------------|
| TInsert_Root | 3,210 | 1,334,114 ns | 5.48 KB | 15 |
| TInsert_WithIndex | 6,988 | 2,837,056 ns | 5.48 KB | 15 |
| TInsert_Nested | 7,137 | 2,886,799 ns | 5.47 KB | 15 |

### Query Operations

| Benchmark | Operations | Time/Op | Memory | Allocations |
|-----------|------------|---------|--------|-------------|
| TChildren_Shallow | 8,336 | 146,253 ns | 19.3 KB | 614 |
| TChildren_Deep | 23,973 | 50,363 ns | 3.05 KB | 44 |
| TChildren_WithLevel | 10,000 | 102,273 ns | 11.1 KB | 316 |
| TParents_Shallow | 29,166 | 41,670 ns | 1.27 KB | 17 |
| TParents_Deep | 29,126 | 40,100 ns | 1.28 KB | 17 |
| TPath_Shallow | 28,970 | 41,284 ns | 3.16 KB | 13 |
| TPath_Deep | 20,064 | 58,948 ns | 4.17 KB | 57 |
| TExists_Exists | 31,198 | 38,556 ns | 1.31 KB | 11 |
| TExists_NotExists | 30,458 | 38,233 ns | 1.31 KB | 11 |

**Key insights**:

1. **TInsert Performance**: Root insertions are fastest at ~1.3ms; nested and indexed inserts take ~2.8ms due to tree traversal
2. **TChildren Memory**: Shallow queries allocate more (614 allocs/op) constructing TreeNode structures; deep trees are more efficient (44 allocs/op)
3. **TParents Efficiency**: Consistent ~40μs performance regardless of depth—ideal for deep hierarchy traversal
4. **TExists Optimization**: Fastest operation at ~38μs—perfect for existence checks before expensive operations
5. **TPath Scaling**: Deep path traversal shows ~43% latency increase but remains practical at ~59μs

## Connection Pooling Considerations

redigo-tree uses the [Redigo](https://github.com/gomodule/redigo) connection pool. Critical configuration:

```go
pool := &redis.Pool{
    MaxIdle:     10,
    MaxActive:   100,
    IdleTimeout: 240 * time.Second,
    Dial: func() (redis.Conn, error) {
        return redis.Dial("tcp", "localhost:6379")
    },
    TestOnBorrow: func(c redis.Conn, t time.Time) error {
        if time.Since(t) < time.Minute {
            return nil
        }
        _, err := c.Do("PING")
        return err
    },
}
```

**Why this matters**: Lua scripts block the connection during execution. Under high concurrency, insufficient pool size causes connection starvation. The `TestOnBorrow` callback prevents using stale connections for script execution.

## Engineering Trade-offs

### What You Gain

1. **Atomicity**: No race conditions, no distributed locks
2. **Performance**: O(1) existence checks, O(log n) traversals
3. **Consistency**: Redis single-threaded model guarantees valid tree state
4. **Simplicity**: No external dependencies beyond Redis and Redigo

### What You Give Up

1. **Memory Overhead**: Parent Sets duplicate references (parent→child AND child→parent)
2. **Script Loading**: Lua scripts must be loaded (via SCRIPT LOAD) on each Redis instance
3. **Redis Version**: Requires Redis 3.2+ for Lua scripting support
4. **Complexity**: Debugging Lua scripts is harder than pure Go code

## When to Use redigo-tree

**Good fit**:
- Hierarchical data requiring frequent updates (org charts, category trees, nested comments)
- High-concurrency environments where race conditions are unacceptable
- Systems already using Redis as primary/secondary store

**Poor fit**:
- Read-heavy trees with rare modifications (consider materialized paths)
- Extremely deep trees (>1000 levels—memory becomes a constraint)
- Multi-Redis deployments requiring cross-instance transactions

## Reference Implementation

The complete source code is available at [https://github.com/zhujiaqi/redigo-tree](https://github.com/zhujiaqi/redigo-tree). The test file (`redigotree_test.go`) contains working examples of all operations.

```bash
# Run tests
go test

# Run benchmarks
go test -bench=. -benchmem
```

## Final Thoughts

Building tree structures on key-value stores requires careful attention to atomicity and consistency. By leveraging Lua scripting, redigo-tree achieves both without distributed locks—a pattern applicable beyond trees to any multi-key transactional requirement in Redis.

The trade-off is complexity: Lua scripts are harder to debug than pure Go. But for high-concurrency hierarchical data management, the atomicity guarantees are worth it.

---

**Further Reading**:
- [Redis Lua Scripting Documentation](https://redis.io/docs/manual/programmability/)
- [Redigo GitHub Repository](https://github.com/gomodule/redigo)
- [ioredis-tree (Original Implementation)](https://github.com/shimohq/ioredis-tree)
