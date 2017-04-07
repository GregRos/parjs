
# Parjs - Parser Combinator Library
[![build](https://travis-ci.org/GregRos/parjs.svg?branch=master)](https://travis-ci.org/GregRos/parjs)
[![codecov](https://codecov.io/gh/GregRos/parjs/branch/master/graph/badge.svg)](https://codecov.io/gh/GregRos/parjs)
[![npm](https://badge.fury.io/js/parjs.svg )](https://www.npmjs.com/package/parjs)

Parjs is a JavaScript library of parser combinators, similar in principle and in design to the likes of [Parsec](https://wiki.haskell.org/Parsec) and in particular its F# adaptation [FParsec](http://www.quanttec.com/fparsec/).

It's also similar to the [parsimmon](https://github.com/jneen/parsimmon) library, but intends to be superior to it.

Parjs is written in TypeScript, using features of ES6+ such as classes, getter/setters, and other things. It's designed to be used from TypeScript too, but that's not necessary.

## What's a parser-combinator library?
It's a library for building complex parsers out of smaller, simpler ones. It also provides a set of those simpler building block parsers.

For example, if you have a parser `digit` for parsing decimal digits, you can parse a number by applying `digit` multiple times until it fails, and then producing the consumed text as a result. Then you can use another *combinator*  to convert the result to a number.

By combining different parsers in different ways, you can construct parsers for arbitrary expressions and language.s

Here is how you might construct a parser for text in the form `(a, b, c, ...)` where `a, b, c` are floating point numbers. One feature of the expression is that arbitrary amounts of whitespace are allowed in between the numbers.

	//Built-in building block parser for floating point numbers.
	let tupleElement = Parjs.float();
	//Allow whitespace around elements:
	let paddedElement = tupleElement.between(Parjs.spaces);
	//Multiple instances of {paddedElement}, separated by a comma:
	let separated = paddedElement.manySepBy(Parjs.string(","));
	//Surround everything with parentheses:
	let surrounded = separated.between(Parjs.string("("), Parjs.string(")"));
	
	//prints [1, 2, 3]:
	console.log(surrounded.parse("(1,  2 , 3 )"));

In the above example, things like `Parjs.float()`, `Parjs.spaces`, and `Parjs.string(str)` are building-block parsers and things like `.between(p)` and `.manySepBy(p)` and *combinators* that work on existing parsers to give you new ones.

Parser-combinators can also emit informative error messages when parsing fails.

## What can you use it for?
Parsing, generally. You can parse all sorts of things:

1. A custom DSL specifying an algorithm for chicken counting.
2. Your own flavor of markdown, just to make things even more confusing.
3. A custom data-interchange format inspired by chess notation.

The possibilities are limitless.

Since it's written in JavaScript, it can be used in web environments.

## What's in a Parjs parser?
A somewhat basic question that deserves an answer. In `Parjs`, a parser is an object that consumes characters from text and returns a value. The number of characters the parser consumes depends on its implementation.

When a parser is invoked on a top level, it is expected to consume the entire input. If it does not, this signals an overall parsing failure. During the parsing process, a `position` value is maintained.

When a parser is invoked as part of a containing parser (e.g. `Parjs.seq(p1, p2)`), then the containing parser chooses how to handle the failure, using information such as the kind of failure and where it occurred. It also chooses how to handle the return value.

When several parsers are strung together in sequence inside a containing parser, the containing parser generally chooses how to apply those parsers. Typically, combinators such as `p1.then(p2)` apply the first parser until it consumes all the input it wants, and then apply the 2nd parser at the exact position the previous parser stopped consuming.

### Immutability
It's important to note that parsers are meant to be immutable objects, and the library is designed around that important premise. 

More specifically, instances of parsers should not depend on instance-level information to process data. You can still edit the parser prototypes, adding combinators and building block parsers.

This allows you to write such idiomatic code as:

	let myString = Parjs.string("my personal string");
	let variant1 = myString.then(Parjs.string(" is the best."));
	let variant2 = myString.then(Parjs.string(" is okay.));

If `myString` were a mutable object, mutating it in one part of the program would then change how `variant1` and `variant2` behave, which would be very suspicous behavior.

In practice, you can design parsers that don't behave this way, but doing so is highly discouraged.

### Failures
Parsers can fail, and this is completely normal in many situations. The `p.or` and `Parjs.any` combinators assume that some of the parsers will fail and will attempt to apply other parsers if that happens. They are failure recovery combinators.

Some failures though indicate *unexpected input* and shouldn't be swallowed by those constructs. For example, consider a parser that parses a floating point number with an optional exponent, such as `1.0e+10`, followed by an arbitrary string. If we're given the input `1.0e+` we *don't* want to parse it as `1.0` followed by the string `e+`. That would obscure what's likely an error in the input.

That's why some kinds of failures are more severe than others and require more advanced recovery constructs.

In general, there are 3 failure severities/failure types:

1. Soft/low severity. This type of severity can be more easily recovered from. It indicates a failure in an internal level that may not translate to a failure on a larger scale. For example, if you use the `p1.or(p2)` combinator, the resulting parser will try `p2` if `p1` fails softly.

2. Hard failure/medium severity. This type of severity indicates some form of unexpected input and is harder to recover from, generally requiring special failure handling combinators like `.soft`.

3. Fatal failure/high severity. This type of failure indicates malformed input. It can be intentionally signalled to catch certain kinds of syntax errors and treat them accordingly. It cannot be recovered from using standard combinators. Even the `.not` combinator, which normally succeeds if the input parser fails, still propagates a fatal failure.

4. Exceptions aren't parent of this hierarchy. Parsers do not and should not throw exceptions to indicate invalid input, and Parjs does not handle thrown exceptions. Rather, an exception indicates a problem with the parser itself.

When an internal parser fails, the containing parser will generally propagate the same or similar parser. When there is no containing parser, a failure result will be emitted, indicating that the overall parsing has failed. In some cases, a soft failure in a child parser indicates a hard failure in a parent parser.

#### Overall Parsing Failure
An overall parsing happens when a parser is invoked by you (the user), and either fails in any manner or fails to consume the entire input (which translates to a failure).

The result from a parsing operation that has failed is of the `FailureResult` type and exposes several important proprerties:

1. The `kind` of the failure.
2. The `trace` object which contains tracing information indicating where the parser failed, and what input was expected. It also contains the parser `state` at the time of the failure.

In addition to emitting a failure result, parsers can also throw exceptions, as mentioned previously. This indicates an error in the parser.

### Quiet Parsers
Earlier I made the claim that all parsers return values. That's not exactly true. There are actually two kinds of parsers: loud and quiet parsers. Whether a parser is loud or quiet is an intrinsic property that is reflected in the TypeScript type system. It's not something that changes based on the input.

In principle, quiet parsers don't return values, only whether parsing succeeded or failed (they may also modify the parser state, see more on that below). In actuality, they do return a special signalling value, but that value is ignored.

Quiet parsers are treated differently by combinators. For example, the `Parjs.seq(p1, p2)` combinator can accept both loud and quiet parsers. It applies parsers in sequence and returns an array of their results. Since quiet parsers aren't considered to return values, they aren't included. Thus `Parjs.seq(loud1, quiet, loud2)` will always return an array with 2 elements. 

Combinators that use the return value of a parser also behave differently, since there is no value to be projected.

Quiet parsers are an important feature of `Parjs`. There are many situations in which you don't care about the return value of a parser and what it to be ignored in aggregation combinators such as sequential ones. 

For this reason, the combinator that turns any parser into a quiet parser is called simply `.q`. 

	let comma = Parjs.string(",").q;
	let hello = Parjs.string("hello").q;

It's not an error to quieten an already quiet parser, but doing so does nothing and may return the exact same parser instance.

	let comma = Parjs.string(".").q.q.q.q.q;

### State
State is a powerful feature that should be used when parsing complex languages, including recursive ones like XML and JSON.

Basically, when you invoke the `.parse(str)` method, a unique, mutable state object is created that is propagated throughout the parsing process. Every parser can read and edit the current parser state. In general, built-in parsers don't use the parser state.

The `.parse` method accepts an additional parameter `initialState` that contains properties and methods that are merged with the parser state:

	//p is called with a parser state initialized with properties and methods.
	let example = p.parse("hello", {token: "hi", method() {return 1;});

Here is an example of how you can use this feature to parse a recursive, XML-like language:

	//define our identifier. Starts with a letter, followed by a letter or digit. The `str` combinator stringifies what's an array of characters.
	let ident = Parjs.asciiLetter.then(Parjs.digit.or(Parjs.asciiLetter).many()).str;
	//A parser that parses an opening of a tag.
	let openTag = ident.between(Parjs.string("<"), Parjs.string(">")).act((result, state) => {
	    state.tags.push({tag: result, content : []});
	}).q;

	let closeTag =
	    ident.between(Parjs.string("</"), Parjs.string(">"))
	        .must((result, state) => result === _.last(state.tags as any[]).tag)
	        .act((result, state) => {
	    let topTag = state.tags.pop();
	    _.last(state.tags as any[]).content.push(topTag);
	}).q;

	let anyTag = closeTag.or(openTag).many().state.map(x => x.tags[0].content);
	console.log(JSON.stringify(anyTag.parse("<a><b><c></c></b></a>", {tags : [{content : []}]}), null ,2));

State is a less idiomatic and elegant feature meant to be used together with, rather than instead of, parser returns. 

## Kinds of Parsers
This is a partial overview of the kinds of parsers and combinators provided by `Parjs`. This is not an exhaustive list.

### Parsers
These are building block parsers provided by `parjs`.

#### Character parsers
One of the most common kinds of parser, parses individual characters.

1. `Parjs.anyChar` - Parses any single character.
2. `Parjs.anyCharOf(str)` - Parses any single character that appears in `str`.
3. `Parjs.digit` - Parses a single digit.
4. `Parjs.asciiLetter` - Parses a single ASCII letter character.

#### String parsers
Parses entire strings.

1. `Parjs.string(str)` - Parses the exact string `str` or fails softly.
2. `Parjs.rest` - Parses the remaining text (if any) and returns it as a string.
3. `Parjs.regexp(rxp)` - Applies the regular expression `rxp` at the current position and returns an array of the match groups.

#### Numeric parsers
These parse multiple characters as numbers, either integers or floating point.

1. `Parjs.int(?options)` - Parses an integer using `options`. If no options object was specified, default options are used.
2. `Parjs.float(?options)` - Parses a floating point number using `options`. These differ from integer parsing options. If no options object was specifie, default options are used.

#### Primitive parsers
These parsers are very simple and don't consume any input.

1. `Parjs.nop` - A quiet parser that consumes no input and returns no value.
2. `Parjs.result(v)` - A loud parser that consumes no input and returns `v`.
3. `Parjs.fail(args)` - A loud parser that always fails with failure information specified in `args`.

#### Special parsers
These special parsers don't belong to any group.

1. `Parjs.position` - A parser that succeeds without consuming input and returns the current position in the stream.
2. `Parjs.state` - A parser that succeeds without consuming input and returns the current parser state.

### Combinators
Here `P` refers to the parser created by the combinator.

### Projections
These combinators create parsers that project the result of the input to a different form. In

1. `p.map(f)` P applies the function `f` to the result returned by `p`.
2. `p.str` P stringifies the result returned by `p`. This means something different for different types. For example, arrays of strings are flattened and concatenated. 
3. `p.act(f)` P applies the function `f` to the result returned by `p` and returns the same thing.
4. `p.q` - P applies `p` and returns nothing. A quiet parser.
5. `p.state` - P applies `p`, ignores its return value and instead returns the parser state object.

### Assertions
These combinators check if a condition applies, and fail if it does not. They accept additional arguments that specify the kind of failure. They don't change the result.

1. `p.must(f)` - P applies `f` on the result of `p` and fails if it retursn false.
2. `p.mustBeNonEmpty()` - P fails if the result of `p` is "empty". This includes various values and is not the same as falsy.
3. `p.mustCapture()` - P fails if `p` succeeds without consuming input.

### Sequential
These combinators apply a number of parsers sequentially.

1. `p1.then(p2)` - P applies `p1` and then `p2`. The result depends on the loudness of `p1, p2`. A highly overloaded combinator.
2. `p2.between(p1, p3)` - P is identical to `p1.then(p2).then(p3)`, except that it returns only the value of `p2`.
3. `p.many(args)` - P applies `p` until it fails softly. Accepts arguments that indicate minimum number of successes required and other information.
4. `p.manySepBy(sep)` - P applies `p` multiple times, every two occurrences separated by `sep`.
5. `Parjs.seq(p1, p2, p3)` - Applies the parsers `p1, p2, p3` in sequence. Returns an array of the results. Quiet parsers don't contribute to the array.
6. `p.thenChoose(selector)` - P applies `p` and then calls `selector` on the result, which returns the parser to apply next.

### Alternatives
These combinators try several parsers in sequence until one of them succeeds. They are a subtype of failure recovery combinators.

1. `p1.or(p2)` - P applies `p1`. If `p1` fails softly, applies `p2` at the same position. Highly overloaded combinator. You cannot mix loudess with this combinator -- e.g. `loud.or(quiet)` is a runtime error (and a compilation error in TypeScript).
2. `p1.orVal(v)` - P applies `p1`. If `p1` fails softly, succeeds and returns `v` without consuming input.

### Primitive
These combinators are very simple.
2. `p.fail(args)` - P applies `p` and fails with `args` if it succeeds. Also propagates failures.
3. 

### Special

1. `p.not` - P succeeds without consuming input or returning a value if `p` fails hard or soft at the current position. If `p` succeeds, P fails softly. Propagates a fatal failure. A quiet parser.
3. `p.backtrack` - P applies `p`, backtracks to the original position in the input (before applying `p`), and returns the result. 


## Performance
Parjs is designed to perform very well, but doesn't sacrifice performance for usability. At present, it's designed to perform best for medium inputs.

It takes a number of steps to ensure high performance. If you want to contribute, you can use these as guidelines for additional parsers/combinators.

1. Minimize all memory allocations on the heap. In most parser bodies, no new objects are created.
2. Do as much work as possible during parser *construction* to make the execution extremely efficient.
3. Use `charCodeAt` internally, instead of `charAt`. Using `charAt` requires creating a new string object.