> There's a ton of stuff to read and digest here, so I think it's best I do it in small parts. I think I'll disregard any notion of structure and go full ADD mode right from the start - so here's some random thoughts:

You’re one too?! That’s great! Yeah go full ADD on it! It’s the best.

# Performance

I’ll answer this one first because it’s relevant to X. Generally, the things that cause CPU or memory bottlenecks are:

1. Allocations, same as in any language
    1. High amounts of GC activity
2. Function calls, which can have quite a bit of overhead, unless they can be inlined. In most cases, calls on polymorphic objects like the parsers can’t be inlined.
3. Function calls, which can have a surprisingly high amount of overhead.
4. Deoptimization, which has an extremely unpredictable effect that can vary between engines.

> In my previous job, I worked on a parser combinator system that was implemented in scala. Whenever it parsed a token in the language, it also recorded metadata about the parsing context.

I think that’s a good approach too. What kind of metadata did it record? Can you talk a bit more about it?

One of my worried is that this would limit performance too much

One of the things I haven’t detailed is something I call a “Capture Trace.” This is similar to a Parse Trace, but while a Parse Trace just gives a path as a position in the parse
