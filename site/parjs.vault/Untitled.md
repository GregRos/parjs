Hmm I’ve decided I should write a bit about _why_ I’ve made the design decisions and changes.

I’ve recently worked on #100 and #98 and generally improving support for parsing Unicode characters. This required a rewrite of the char-info package with the following goals:

1. Support characters outside the BMP
2. Improve performance by using a more efficient data structure
3. Create an automatic process to construct the data structure based on a given Unicode version, where previously it was just some stuff I copied and pasted from another library.
4. Do the same for type definitions involving the names of Unicode entities, such as Scripts, Blocks, Properties, and Categories.

I also had some ideas for improving the package’s performance by an order of magnitude.

As part of that project, I decided to use `parjs` to parse the UCD, the Unicode Character Database. To see how that looks like, you can check out [this branch](https://github.com/GregRos/parjs/tree/feature/ucd-parser).

I thought this would be a really good exercise of dogfooding, as well as a usability and performance test (the UCD includes text files the size of multiple megabytes).

I haven’t used the library for a while, and honestly I found using it quite frustrating, and not up to my standards today. There were many issues:

1. Debugging was very frustrating and did not create a connection between the code I was writing and the error I was seeing
2. Visualizations were frequently misleading or incorrect
3. Failure reasons were confusing and unclear

Moreover, performance was frankly quite bad, when compared to using more primitive string operations and even in some cases to regular expressions. The UCD doesn’t actually contain Unicode characters, only ASCII, so this wasn’t related to the char-info package at all.

As I was using it, I came up with many ideas for improving the package’s design and performance. Some of them are based on the proposal #101, while other ideas were stuff I had cooking my brain over the past year or so, including the list of ideas I conveyed to @mikavilpas back in October.

Some concepts:

1. Formalizing the concept of a “parse graph” that lived in my head since I started working on the library.
    1. A trace that points to a position in the parse graph, which can be formatted as a string similar to a stack trace.
2. “Fatter” parser nodes constructed incrementally using tuners and boosters, instance methods that don’t create parent parsers but instead return a new parser based on the current one.
3. This is especially true for char parsers, which use an entirely different model that supports parsing arbitrarily complex character classes without any change to performance.
4. Making the “character” be parser-specific and not related to JavaScript characters.
5. A lot of precomputation when creating parsers in order to improve performance when executing them.
    1. Capturing stack traces when parsers are created to link parsing failures to user code.
