y





# Parjs - Parser Combinator Library

[![build](https://travis-ci.org/GregRos/parjs.svg?branch=master)](https://travis-ci.org/GregRos/parjs)
[![codecov](https://codecov.io/gh/GregRos/parjs/branch/master/graph/badge.svg)](https://codecov.io/gh/GregRos/parjs)
[![npm](https://badge.fury.io/js/parjs.svg )](https://www.npmjs.com/package/parjs)

[API Documentation](https://gregros.github.io/parjs/)

Parjs is a JavaScript library of parser combinators, similar in principle and in design to the likes of [Parsec](https://wiki.haskell.org/Parsec) and in particular its F# adaptation [FParsec](http://www.quanttec.com/fparsec/).

Parjs was originally meant to be pronounced *"Paris"*, because the *j* kind'a looks like an *i*, but I just kept calling it *par-js* in my head anyway, so make of that what you will.

It's also similar to the [parsimmon](https://github.com/jneen/parsimmon) library, but intends to be superior to it. Some of its features:

1. Many more combinators and basic parsers.
2. Support for parsing Unicode characters.
3. Written in TypeScript with ES6 features.
4. Systematically documented.
5. Advanced debugging features and ability to parse very complex languages.

Parjs is written in TypeScript, using features of ES6+ such as classes, getter/setters, and other things. It's designed to be used from TypeScript too, but that's not necessary.

Starting from version 0.12.0, Parjs is written to leverage [tree-shaking][tree-shaking]. If you don't use something in the library, it won't be inserted into your bundle. This includes the Unicode parsers. They're pretty heavy.

Parjs parsers are called "Parjsers". I'm not sure how to pronounce that either.

## Parjs 0.12.0

I decided to make lots of changes to the library, including refactoring lots of code, renaming things, and redesigning the API to support things like tree shaking. I started this library when I had less experience, so after a few years I think I can make some cool improvements.

I've been seeing more and more stars and views recently, so I was thinking this might be the last time I can do something like this.

Some major things that have been changed:

* No quiet parsers that don't return values. Now all parsers return values. This seemed like a nice feature in my head, but turned out to cause difficulties down the road.
* Combinators use a `pipe` method and function operators instead of instance methods. See more on this below.
* Names for some types and objects.

## Example Parsers
You can see implementations of example parsers in the `examples` folder:

1. [Tuple Parser](https://github.com/GregRos/parjs/blob/master/src/examples/tuple.ts) 
2. [JSON parser](https://github.com/GregRos/parjs/blob/master/src/examples/json.ts)
4. [Math Expression Parser](https://github.com/GregRos/parjs/blob/master/src/examples/math.ts)

## What's a parser-combinator library?
It's a library for building complex parsers out of smaller, simpler ones. It also provides a set of those simpler building block parsers.

For example, if you have a parser `digit` for parsing decimal digits, you can parse a number by applying `digit` multiple times until it fails, and then producing the consumed text as a result. Then you can use another *combinator*  to convert the result to a number.

By combining different parsers in different ways, you can construct parsers for arbitrary expressions and languages.

Here is how you might construct a parser for text in the form `(a, b, c, ...)` where `a, b, c` are floating point numbers. One feature of the expression is that arbitrary amounts of whitespace are allowed in between the numbers.

```ts
import {float, string, whitespace} from "parjs";
import {between, manySepBy} from "parjs/combinators"

//Built-in building block parser for floating point numbers.
let tupleElement = float();

//Allow whitespace around elements:
let paddedElement = tupleElement.pipe(
	between(whitespace())
);

//Multiple instances of {paddedElement}, separated by a comma:
let separated = paddedElement.pipe(
	manySepBy(",")
);

//Surround everything with parentheses:
let surrounded = separated.pipe(
	between("(", ")")
);

//prints [1, 2, 3]:
console.log(surrounded.parse("(1,  2 , 3 )"));
```

In the above example, `float`, `string`, and `whitespace` are building-block parsers that parse certain kinds of text, and `between` and `manySepBy` are *combinators*, which take those parsers and apply them in different ways.

## What can you use it for?
Parsing, generally. You can parse all sorts of things:

1. A custom DSL specifying an algorithm for chicken counting.
2. Your own flavor of markdown, just to make things even more confusing.
3. A custom data-interchange format inspired by chess notation.

The possibilities are limitless.

Since it's written in JavaScript, it can be used in web environments.

## What's this weird `pipe` method?

Prior to version 0.12.0, `parjs` implemented combinators as instance methods. This is nice, but has downsides:

1. It's less convenient to add your own combinators, since that required modifying the prototype.
2. More importantly, it makes [tree-shaking][tree-shaking] impossible. So even if you don't use one of the combinators, you still have to put it into your bundle. This is a big deal for web environments.

Parjs makes the same move as [rxjs][rxjs], another much more popular library of combinators (though a different kind) and introduces an API based on higher-order function operators, what rxjs calls [lettable operators](lettable-operators). 

Each parser supports one key prototype method: `pipe`, and this method accepts a chain of functions that feed into each other, transforming the original, source parser.

These transformations are created by calling other functions and giving them various arguments. For example, the factory function for the `map` combinator looks like this:

```typescript
function map<A, B>(projection: (x: A) => B): ParjsCombinator<A, B>
```

Where:

```typescript
type ParjsCombinator<A, B> = (source: Parjser<A>) => Parjser<B>;
```

So it's a function that returns another function. Here is how it's used in practice:

```typescript
import {map} from "parjs/combinators";
import {string} from "parjs";

const parser = string("test").pipe(
	map(result => result.length)
);
```

In most ways, this API is identical to the prototype-based API. Instead of writing `parser.map(f)`, you write `parser.pipe(map(f))`. This is more long-winded, but the benefits outweigh the drawbacks.

## Import paths

* `"parjs"` - here you will find the building-block parsers and no combinators. Also, commonly used types if you're working from TypeScript.
* `"parjs/combinators"` - here you will find combinators, the stuff you give the `pipe` method.
* `"parjs/errors"` - here are some error types `parjs` can throw.
* `"parjs/internal"` - here be dragons. See "creating custom parsers" from more details.

## Implicit parsers

Combinators that accept parsers as parameters can be given a literal instead. Two types of literals are supported:

1. A string.
2. A regular expression.

These literals are automatically converted to parsers that parse them, using the `string` and `regexp` parsers, respectively. So while it is clearer to write:

```typescript
let p = string("a").pipe(
	then(string("b"))
);
```

You can simply write:

```typescript
let p = string("a").pipe(
	then("b")
);
```

And your code will behave the same way.

## Immutability

Parjs parsers are functionally immutable. That is, once a Parjser is created, it will always do the same thing, whether it's applied for the first or tenth time. Some things, like non-functional metadata, may be subject to change though.

This allows you to write such idiomatic code as:

```ts
let myString = string("my personal string");
let variant1 = myString.pipe(
	then(" is okay.")
);
let variant2 = myString.pipe(
	then(" is the best.")
);
```

If `myString` changed when it parsed something, it would influence both `variant1` and `variant2`, which is obviously undesirable.

## Result

All parses return some sort of result when they parse something. In the past, there used to be silent parsers that didn't return results, but this is not the case anymore.

The result of a parser has the property `value` that exposes its result value.

## Rejection

When parsers don't succeed for an input, they reject or fail. There are several different kinds of failure:

1. A *soft* failure is an expected failure which can be easily recovered from. It usually means that a parser is not appropriate for parsing a given input and another parser should be attempted. 
2. A *hard* failure usually signals unexpected input. Recovering from this failure may require backtracking a non-constant distance. Combinators like `or` will recover from a hard failure.
3. A *fatal* failure is unrecoverable. Built-in parsers don't fail in this way, but you can signal this kind of failure using various assertion combinators like `must`.
4. If an exception is thrown, that doesn't indicate parsing the input failed - it means there is a problem in one of the parsers. Parsers aren't supposed to throw errors.

The difference between soft and hard failures can be seen when talking about combinators that provide a list of alternatives. 

```typescript
let pNumber = string("hello").pipe(
	or(
        "hi",
        "good evening"
    )
);
```

A soft failure indicates the parser isn't appropriate for a given input, and another parser from a list of alternatives should be attempted. A hard failure means that the parser worked at first and expected the input to be in a certain format, but the input broke that expectation.

Parsers that use sequential combinators - such as `then` - will expect all of their component parsers to succeed if the first one succeeded. If a later parser fails, it means an expectation was broken and a hard failure should be emitted.

Hard failures also happen for specific kinds of malformed input. For example, a `float` parser trying to parse `1.0e+hello` will error because after `1.0e+`, the parser expected to find an exponent but found something else instead.

## User State

User state is a powerful feature that can be used when parsing complex languages, such as mathematical expressions with operator precedence and languages like XML where you need to match up an end tag to a start tag.

Basically, when you invoke the `.parse(str)` method, a unique, mutable user state object is created that is propagated throughout the parsing process. Every parser can read and edit the current parser user state. Built-in parsers aren't allowed to use the user state directly (they can do other things), so the only information in it will be what you put inside it.

The `.parse` method accepts an additional parameter `initialState` that contains properties and methods that are merged with the user state:

```ts
// p is called with a parser state initialized with properties and methods.
let example = p.parse("hello", {token: "hi", method() {return 1;});
```

Among other uses, user state allows you to parse operator precedence using LR parsing techniques even though Parjs is essentially a library for LL parsers.

Some combinators that project the result of a parser take a function with two arguments, the first being the result and the 2nd being the state object.

User state is a less idiomatic and elegant feature meant to be used together with, rather than instead of, parser returns.

You can also make use of the advanced  `isolateState` combinator. This combinator lets you isolate a parser's user state from other parsers. This lets you write a black-box parser that still uses user state.

## Writing a parser with custom low-level logic

**In most cases, it should be easy to use existing combinators and building block parsers to create what you want. You shouldn't automatically write a custom parser.**

However, `Parjs` is meant to be very easy to extend, so if you can't use existing code to do your work for you, writing your own is very simple

### Creating the parser

To create a custom parser, you need to extend the class `ParjserBase` from `parjs/internal`. This class already implements the `Parjser<T>` interface and provides a bit of boilerplate functionality. It's also required for other combinators to properly recognize your custom parser.

You'll need to implement:

1. The `_apply` method, which contains the actual parser logic.
2. The `expecting` property, which is a text specifying what input the parser action is expecting to parse. For example, it could be `a digit`, `end of input`, or something else. The text is generally set when the parser is constructed. It is needed for displaying relevant debugging information.
3. The `type` property, which is a string that is used for identifying the parser type.

### Parser logic

When the `.parse` method is called, a [`ParsingState`](https://gregros.github.io/parjs/interfaces/parjs_internal.parsingstate.html) object is created. This is a mutable object that indicates the state of the parsing process. Here are some of its members:

```ts
interface ParsingState {
    readonly input : string;
    position : number;
    value : any;
    userState : any;
    reason : string;
    kind : ReplyKind;
    //...
}
```

This object is given to the `ParjserBase._apply` method, and this method is meant to mutate this object to indicate things like:

1. The input consumed (via `position`)
2. The value returned.
3. The success status (via the `kind` field).
4. Changes in the user state.

Your `_apply` method has to:

1. Set the `kind` field of the `ParsingState`. This is how the action communicates success or failure. 
2. If the `kind` is set to `OK`, you *have to* modify the `value` property to return a value. You can even set it to `undefined`. But you have to set it to something.

Not doing these things will cause an error to be thrown.

Here is an example of one implementation. This implementation checks if parsing has reached the end of the input (e.g. `eof()`).

```ts
_apply(ps : ParsingState) {
    if (ps.position === ps.input.length) {
        ps.kind = ReplyKind.OK;
        ps.value = undefined;
    } else {
        ps.kind = ReplyKind.SoftFail;
    }
}    
```

[tree-shaking]: https://webpack.js.org/guides/tree-shaking/
[rxjs]: <https://rxjs-dev.firebaseapp.com/>
[lettable-operators]: <https://blog.angularindepth.com/rxjs-understanding-lettable-operators-fe74dda186d3>