# immutable-unicode-trie

A high-performance persistent data structure for storing information about Unicode characters.

- Store 32-bit integers or 1 bit per codepoint.
- Uses structural sharing and relatively high granularity for good space efficiency.
- Optimized for constructing from ranges of codepoints.
- Very fast lookups, potentially fast writes, sparse, takes advantage of range-based data.

This data structure is similar to [unicode-trie](https://www.npmjs.com/package/unicode-trie) but immutable and persistent. 

It's good, but it has the potential to become even better with successive optimizations. See the repository for more info about that.

- It's implemented using an [array-mapped trie](https://en.wikipedia.org/wiki/Array_mapped_trie), as seen in:
  - [Scala's `Vector`](https://github.com/djspiewak/scala-collections/blob/master/src/m ain/scala/com/codecommit/collection/Vector.scala) (Scala)
  - [Clojure's PersistentVector](https://github.com/clojure/clojure/blob/master/src/jvm/clojure/lang/PersistentVector.java) (Java)
  - [Imms's `TrieVector`](https://github.com/GregRos/Imms/blob/e5fa401776206c8dfb3f551f1c60928325c0f9a1/Imms/Imms.Collections/Implementation/TrieVector/VectorParent.cs) (C#)

- It's inspired by ICU's [UTrie](https://unicode-org.github.io/icu/design/struct/utrie.html).

Written for parsing Unicode characters.

**_Personal Note:_** Haven't cooked one of these up in a while. It's good to be back.

