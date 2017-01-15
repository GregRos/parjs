# Parjs - Parser Combinator Library
[![build](https://travis-ci.org/GregRos/parjs.svg?branch=master)](https://travis-ci.org/GregRos/parjs)
[![codecov](https://codecov.io/gh/GregRos/parjs/branch/master/graph/badge.svg)](https://codecov.io/gh/GregRos/parjs)
[![npm](https://badge.fury.io/js/parjs.svg )](https://www.npmjs.com/package/parjs)

Parjs is a JavaScript library of parser combinators, similar in principle and in design to the likes of [Parsec](https://wiki.haskell.org/Parsec) and in particular its F# adaptation [FParsec](http://www.quanttec.com/fparsec/).

It's also similar to the [parsimmon](https://github.com/jneen/parsimmon) library, but intends to be superior to it.

Parjs is written in TypeScript, using features of ES6+ such as classes, getter/setters, and other things. It's designed to be used from TypeScript too, but that's not absolutely necessary.

## What's a parser-combinator library?
It's a library for building complex parsers out of smaller, simpler ones. It also provides a set of those simpler building block parsers.

For example, if you have a parser `digit` for parsing decimal digits, you can parse a number by applying `digit` multiple times until it fails, and then producing the consumed text as a result. 

By combining different parsers in different ways, you can construct parsers for arbitrary expressions. 

Here is how you might construct a parser for text in the form `(a, b, c, ...)` where `a, b, c` are integers. One feature of the expression is that arbitrary amounts of whitespace are allowed between tokens.

	let int = Parjs.int(); //parse an integer, sign allowed
	let sep = Parjs.string(",").then(Parjs.spaces).quiet; //equivalent to the regex /,\s*/
	let openingParen = Parjs.string("(").quiet;
	let closingParen = Parjs.string(")").quiet;
	let separated = int.manySepBy(sep);
	let final = Parjs.seq(openingParen, Parjs.spaces.quiet, separated, Parjs.spaces.quiet, closingParen).map(x => x[0]);
	
In the above example, we use built-in basic parsers for specific strings and integers, and we also use several *combinators* that work on those parsers and combine them to give new ones.

First we use `manySepBy`, that parses occurences of parser `p` (in this case, the `int` parser) separated by occurrences of `sep` (in this case, the string `, `). Then we also use then `seq` combinator, that applies multiple parsers in sequence and returns their results in an array.

Parser-combinators allow you to construct complicated parsers in a concise and readable way, a lot closer to the problem domain (recognizing a distinctive grammar) than the bare metal of iterating over characters and comparing them.

Parser-combinators can also emit informative error messages when parsing fails.

## What can you use it for?
Parsing, generally. You can parse all sorts of things:

1. A custom DSL specifying an algorithm for chicken counting.
2. Your own flavor of markdown, just to make things even more confusing.
3. A custom data-interchange format inspired by chess notation.

The possibilities are limitless.

Since it's written in JavaScript, it can be used in web environments.

## How it's used
Parjs comes with a few different components:

1. Basic parsers for parsing things like specific characters, specific strings, and numbers.
2. Combinators that work on one or more parsers to create a complex parser.
3. Helper functions for doing things like recognizing characters.

In general, the `Parjs` object in the `parjs` module contains builidng block parsers and combinators are defined as instance methods of parsers. However, there are also some combinators, called *static combinators*, that are defined on the `Parjs` object.

### Examples of parsers:

1. `Parjs.string(str)` defines a parser that parses the string `str` and returns it.
2. `Parjs.int(options)` defines a parser that parses an integer with `options` being an object containing options.

### Static combinators:
1. `Parjs.any(p1, p2, ...)` Returns a parser that attempts to parse using `p1, p2, ...` until it succeeds.
2. `Parjs.seq(p1, p2, ...)` Returns a parser that applies `p1, p2, ...` in sequence.

Static combinators are generally used when there isn't a single parser that can be considered *this* parser on which the combinator is principally applied.

### Instance combinators:
1. `p1.then(p2)` First applies `p1` and then `p2`.
2. `p1.map(x => x + 1)` Returns a parser that applies `p1` and then transforms the result using the function `x => x + 1`.

Instance combinators are used when it makes sense for one parser to be a *this* parser, on which the combinator is principally applied.

## Deeper mysteries

### Failures
Parsers can fail, and this is completely normal in many situations. The `p.or` and `Parjs.any` combinators assume that some of the parsers will fail and will attempt to apply other parsers if that happens. They are failure recovery combinators.

Some failures though indicate *unexpected input* and shouldn't be swallowed by those constructs. For example, consider a parser that parses a floating point number with an optional exponent, such as `1.0e+10`, followed by an arbitrary string. If we're given the input `1.0e+` we *don't* want to parse it as `1.0` followed by the string `e+`. That would obscure what's likely an error in the input.

That's why some kinds of failures are more severe than others and require more advanced recovery constructs.

When a component parser of a complex parser fails and the parser cannot recover, the internal failure will be translated into a failure result that contains an error message and failure severity.

#### Soft failures
Soft failures are low-severity failures that can be expected to occur. Combinators like `or` can recover from soft failures. They usually occur when a parser fails before it has developed an expectation about the input. For example, a parser that's supposed to parse an integer will fail softly if the first character it finds isn't a digit.

A soft failurem means that a parser that was used doesn't apply to the input it's parsing.

#### Hard failures
A hard failure occurs when a parser develops an expectation about the input, but the input breaks that expectation. For example, a floating point parser that encounters an `1.0e` will expect a well-formed exponent string. If the string is `1.0e+` it will not try to find other interpertations for the input; it will just emit a hard failure with an error message.

This is preferable because backtracking in order to understand the input 

Hard failures can be recovered from using the `p.soft` instance combinator. It turns hard failures into soft ones. Otherwise a hard failure will propagate up and the parser will return a failure as a result.

#### Fatal failures
Fatal failures occur when a parser or a function argument of a parser throws an exception, or else when they are emitted on purpose (e.g. using the `Parjs.fail(FailureKind.Fatal)` parser). They indicate an error that cannot be recovered from and will always propagate into a failure result.

Such a failure usually indicates parsing cannot continue because the input violated some important expectation.

### Loud Parsers and Quiet Parsers
Although all parsers nominally return a value, in some cases you may not care about the value they return and it is best that Parjs ignore it completely.

For example, say you want to parse an integer between two quotes as follows

	let pQuote = Parjs.string("'");
	let pIntQuotes = Parjs.seq(pQuote, Parjs.int(), pQuote);

While `pQuote` returns a value, you don't care about the value and having it in the final result (the array `["'", n, "'"]`) will just make working with the parser uncomfortable.

Parjs provides a special feature to handle this kind of thing: quiet parsers and loud ones.

A loud parser returns a value, and a quiet parser doesn't. It only tells you if parsing succeeded or not, and when used together with other parsers, consumes part of the input. Quiet parsers are treated specially by Parjs. If you use a combinator such as `seq` that returns an array of results, quiet parsers won't contribute elements to that array. They also support slightly different members, since it doesn't make sense to invoke the `map` combinator, which transforms the parser's return value, as quiet parsers do not have a return value.

Also, if you use the `then` instance combinator with a quiet parser and a loud parser, it returns a loud parser that returns a single value (the one from the loud parser) instead of an array with a single element. `then` used on two quiet parsers also returns a quiet parser.

You can make any parser quiet using the `.quiet` combinator.

## Performance
Parjs is designed to perform very well, but doesn't sacrifice performance for usability. At present, it's designed to perform best for medium inputs.

It takes a number of steps to ensure high performance. If you want to contribute, you can use these as guidelines for additional parsers/combinators.

1. Minimize all memory allocations on the heap. In most parser bodies, no new objects are created.
2. Do as much work as possible during parser *construction* to make the execution extremely efficient.
3. Use `charCodeAt` internally, instead of `charAt`. Using `charAt` requires creating a new string object.