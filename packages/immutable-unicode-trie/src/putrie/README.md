# immutable-unicode-trie

A high-performance persistent data structure for storing information about Unicode characters.

-   Store 32-bit integers or 1 bit per codepoint.
-   Uses structural sharing and relatively high granularity for good space efficiency.
-   Optimized for constructing from ranges of codepoints.
-   Very fast lookups, potentially fast writes, sparse, takes advantage of range-based data.

This data structure is similar to [unicode-trie](https://www.npmjs.com/package/unicode-trie) but immutable and persistent.

## Background

### Array-mapped Tries

One of the primary data structures used to implement persistent collections that are similar to JavaScript arrays or C++ vectors.

It's used in imperative languages or runtimes primarily designed for mutability rather than persistence, and has a history of good real-world performance.

A persistent AMT is implemented using nested arrays, popularized by Clojure. Some good examples of implementations of this data structure:

-   [Scala's `Vector`](https://github.com/djspiewak/scala-collections/blob/master/src/m ain/scala/com/codecommit/collection/Vector.scala) (Scala)
-   [Clojure's PersistentVector](https://github.com/clojure/clojure/blob/master/src/jvm/clojure/lang/PersistentVector.java) (Java)
-   [Imms's `TrieVector`](https://github.com/GregRos/Imms/blob/e5fa401776206c8dfb3f551f1c60928325c0f9a1/Imms/Imms.Collections/Implementation/TrieVector/VectorParent.cs) (C#), by me.

This data structure benefits from runtimes that support fast array lookups.

Unlike these other data structures, but similarly to hash array mapped tries, the `PUTrie` supports sparse data.

### UTrie

The `UTrie` is a flattened trie stored in one contiguous block of memory. Its C++ version is highly optimized and was constructed over years of careful benchmarking.

It's one of the main data structures used to implement character lookups and has ports for a large number of languages, including [JavaScript](https://github.com/foliojs/unicode-trie/blob/master/index.js).

The `PUTrie` is meant to be a persistent version of this data structure, written for pure JavaScript. It's primarily designed to store a single bit for each Unicode character, but can also be used to store integers instead.

As of this writing, the `PUTrie` isn't as highly optimized as the `UTrie` it seeks to copy, but there is a lot of potential for growth. Performance similar to the UTrie is achievable.

## PUTrie ⚡

Okay, with that out of the way, let's talk about the data structure.

The `PUTrie` consists of 5 levels, though only 4 levels will be in use at a given time. When storing bits, one of the levels is a bitmap, which barely counts as a data structure, so the `PUTrie` can be said to have 3 levels.

Each bitmap is a 32-bit integer, which lets the rest of the key be only 16 bits long. However, when ints are stored per character, an extra level is needed.

`Level_3` exists to support this use-case.

| Level     | Implementation   | Note                                           | W    |
| --------- | ---------------- | ---------------------------------------------- | ---- |
| `Level_3` | `Array<Level_2>` | Used only when storing `uint32`.               | 5¹   |
| `Level_2` | `Array<Level_1>` | Topmost level when storing bits.               | 6¹²  |
| `Level_1` | `Array<Level_0>` | Middle level containing binary data blocks     | 5¹²  |
| `Level_0` | `Uint32Array`    | Binary data block.                             | 5¹²  |
| `Level_B` | `uint32`         | A bitmap. Used to pack bits.                   | 5²   |
|           |                  |                                                | 21¹² |
|           |                  | (**W** is the length of the key at each level) |      |

Each level has its own modular structure, containing functions that manipulate arrays directly.

This is done in order to make sure all code is monomorphic and there are no expensive property or method lookups. Nothing is recursive and simple operations are kept short, to encourage inlining.

Sadly, this is required because as of this writing, code that is in any way generic or polymorphic will suffer significant performance hits. Recursion similarly makes some optimizations impossible, and tail recursion is not consistently optimized.

However, really low-level optimizations such as inlining and loop unrolling should not be required, as JS engines can do those automatically. It's just a bit up in the air if they happen or not.

Each level contains almost identical code, and a future improvement would be to port it to a template language or other code generation.

### Bit lookups

This data structure is used to implement character classes --- sets of Unicode characters that are accepted by a parser. This is achieved by storing a bit that says whether a character is included or not.

These bits are packed into 32-bit integers and looked up individually.

### Binary operations

`PUTrie` supports fast binary operations between `PUTrie`s in order to implement `and` and `or` operations on char classes.

### Sparse data

The Unicode range is huge --- 21 bits long -- but only a fraction of that range is assigned. Those parts of the range which are assigned can sometimes be extremely sparse.

Besides that, character classes themselves are likely to be sparse, with parsers being created that will only parse characters from a single script, or category, and so forth.

Because of this, support for sparse data is absolutely crucial for the data structure, as storing a million 0s in memory is kind of a waste.

Luckily, the AMT data structure is very good at storing sparse data, so good it's often used as a hash map.

The `PUTrie` has an additional optimization for dealing with sparse data -- dummy nodes. These nodes will return a `1` or ` 0` for all bit lookups in their range, without needing to do any work or store anything.

In principle, this can be extended to nodes that return arbitrary integers, but I decided to avoid adding this as the data structure is already complicated enough.

One downside is that the data structure can't represent sparseness below `Level_1`. So in the worst case, 1 bit in the wrong place can consume 128 bytes.

### Ranges

Unicode consists of ranges of nearly contiguous blocks, and character classes will be often be similarly range-based.

For this reason, `PUTrie` supports a fast operation called `fold` used to construct a trie from a sequence of codepoint ranges, to which `1` is assigned. The operation is $O(n)$ and highly efficient.

The `fold` operation pads data with dummy nodes when possible.

###

## Future improvements

A lot of improvements can be made to the maintainability of the data structure.

### Code generation

This data structure involves a lot of duplicate code. It would greatly improve maintainability if the code can be reproduced using a templating language or some other code generation tool.

### Error messages

Currently, the data structure lacks clear and legible error messages.

###

## Future optimizations

While the data structure is fast, it's primarily optimized for read performance, construction of a `PUTrie` from range data, and serialization.

Several improvements can be made to make better use of memory and improve write performance.

### Queued Writes [Space, Time]

This is a multi-part optimization that's designed to improve writes by:

1. Minimizing creation of intermediate objects that will never be used by the user.
2. Reducing garbage collection.
3. Reducing copying overhead.
4. Spreading out expensive writes over a larger number of operations.

It has several parts.

#### Queuing writes [Space, Time]

Queue all write operations instead of executing them immediately. There can be one queue per trie, but queues can also be maintained for each `Level_1` object and higher.

1. Requires an immutable queue. This can either be a persistent data structure of its own, or simply an array that's copied when written to.
2. The queue can be compacted, merging related operations into a single one.

Writes can be performed either:

1. On the next read operation
2. On the next read to the `Level_X` object.

The first option makes keeping track of writes easier, while the 2nd allows spreading out writes over a larger number of operations.

#### Bulk operations [Space, Time]

Just queueing writes won't be that useful if they need to happen in the same way. However, by writing faster bulk versions of write operations, a lot of copying overhead can be avoided, which will:

1. Greatly improve write performance when the bulk operation is used.
2. Reduce the creation of unnecessary objects

Bulk operations generally need to be carefully hand-coded. However, there is another option that keeps most of the benefits, has a few more, but also requires less work.

#### Mutation control [Space, Time]

Currently, some operations accept a boolean parameter called `mut` which if true, will mutate the data structure instead of copying.

This parameter is a very crude form of mutation control that's quite limited in its usefulness. Much better solutions are possible.

One method I've used in the past is a Lineage parameter. This parameter is a unique ID that is applied to every object created as part of a given write operation.

When future write operations encounter a node with the same Lineage, it can mutate it directly instead of copying it.

Invoking multiple write operations using the same Lineage will have most of the benefits of invoking an efficient bulk operation, while avoiding the need to write such an operation, instead reusing code that has already been written.

This assures all mutations happen "behind the scenes" and the user still receives a functionality immutable data structure, while almost all the benefits of a highly optimized bulk operation can be achieved by simply making the same method calls using the same Lineage.

In addition, mutation control allows optimizing arbitrary sequences of operations instead of just a single operation applied multiple times.

### Compacting [Space]

The trie can be compacted by identifying identical memory blocks. This is something that happens in the `UTrie` data structure.

`PUTrie` can instead be globally compacted at every level. One approach would be computing a cheksum for each block and using that to find blocks that can be merged.

This is a costly optimization that will need to be undone if the character class is modified.

### Range detection [Space]

Currently, dummy nodes are only used when constructing a trie from ranges. However, a sequence of separate writes can also result in a trie structure consisting of contiguous 1s or 0s.

It's possible to detect this and replace the write with a dummy node.

### Granularity [Space]

While `Uint32Array` is a fast data structure, it's not one that can represent sparseness. This can mean that a currently unknown amount of data will be wasted by these data blocks.

While I don't know if this will be a problem or not at this stage, there are several possible solutions.

They all involve reducing the key width of level `0`, and either adding another level between `0` and `1` which can support sparseness, or just increase key widths up the trie.

###
