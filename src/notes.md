## Performance

At present, although Parjs is designed with performance in mind, it's not benchmarked and hasn't been optimized.

In general, a few measures are taken to improve performance:

1. Minimize all memory allocations on the heap. In most parser bodies, no new objects are created.
2. Do as much work as possible during parser *construction* to make the execution extremely efficient.
3. Use `charCodeAt` internally, instead of `charAt`. Using `charAt` requires creating a new string object.

The factor that probably slows down Parjs the most is the amount of method calls that is dynamically dispatched and the actions every parser has to do to figure out if the parser code terminated correctly.

It should be possible to reduce these by:

1. Merging identical parsers, such as two `.map` parsers.
2. Optimizing away some parsers if they have no affect on the output.
3. Making "fatter" versions of existing parsers in order to compress the parse tree.
4. Reducing the parser overhead in certain situations.
5. Make sure JavaScript code is optimized correctly by modern JavaScript engines, such as the V8 engine.