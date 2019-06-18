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

### Using combinators like regular functions

You don't really have to use the `.pipe` method. Combinators are just functions that return functions, and you can call the combinator and the function it creates in a single expression. For example:

```typescript
let hiOrHello = or("hi")("hello");
```

## Import paths

* `"parjs"` - here you will find the building-block parsers and no combinators. Also, commonly used types if you're working from TypeScript.
* `"parjs/combinators"` - here you will find combinators, the stuff you give the `pipe` method.
* `"parjs/errors"` - here are some error types `parjs` can throw.
* `"parjs/trace"` - Visualizing parser failures.
* `"parjs/internal"` - here be dragons. See "creating custom parsers" from more details.

## Parsing Unicode

Parjs can parse Unicode characters in the BMP (Basic Multilingual Plane), which includes all but the most exotic of characters. This is done using the [`char-info`][char-info] package of character recognizers.

Parsers such as `upper()` only parse the ASCII subset of Unicode. Only parsers with names beginning with `uni`, such as `uniUpper()`, parse all Unicode characters. These parsers are inherently slower, because each character needs to be looked up in a tree-like data structure.

Parjs supports tree-shaking, so if you have this feature enabled, it will only embed Unicode data into your bundle if you use the Unicode features.

If you want to parse characters from specific scripts or with other special properties, you should import the `char-info` package yourself.

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

## Success and failure

When the `.parse` method of a Parjser you get a result which can indicate either success or failure. You can tell these apart using the `.kind` property, or using the shorthand `.isOkay`:

```typescript
let result = parser.parse("hello");

// true if result.kind === "OK"
if (result.isOkay) {
    // it succeeded
} else {
    // result.kind === "Soft", "Hard", "Fatal"
}

```

You can get the parser's return value by using the `.value` property of the result object, but it will throw an error if the object is a failure.

```typescript
let finalResult = result.value;
```

Failures have the extra property `trace` which gives you a trace of where the failure happened, which parser caused it, and other information you can use to diagnose it. 

```typescript
let {
    trace,
    reason,
    kind,
} = result;
```

The `trace` property contains a detailed object with a trace of parsers that led to the failure, the location of the failure, and more. This information is used when you stringify a failed result object with `.toString()`:

```typescript
console.log(result.toString());
// Soft failure at Ln 1 Col 1
// 1 | hello!
//     ^expecting 'hi'
// Stack: string
```

### Failure types

There are several failure types recognized by the library. They're used for slightly different purposes that can drastically change how a parser behaves. From least to most severe, they are:

1. Soft failure
2. Hard failure
3. Fatal failure

Different failure types let you accept alternative inputs while not swallowing important syntax errors and not backtracking too much.

Failure bubbles up the parser tree until a parser can handle it, like an exception does. Parsers that deal with Soft failures will usually not handle Hard ones.

#### Soft failure

A parser fails softly if it receives input which it immediately sees as inappropriate. 

This kind of failure allows alternative parser combinators like the `or` combinators to work. The `or` combinator looks like this:

```typescript
let option1 = string("option1");
let option2 = string("option2");
let either = option1.pipe(
	or(option2)
);
```

The combinator will try the `option2` parser if `option1` does not work. This not-working is signalled by a soft failure. If `option2` reports a soft failure too then `either` will bubble that failure up, possibly with some more information.

One way of describing a soft failure is that it doesn't consume much of the input and doesn't require much backtracking.

#### Hard failure

A hard failure means the parser started parsing the input but encountered something unexpected. 

Hard failures are common and are usually caused by syntax errors. A common hard failure appears when you have a parser that uses the `then` sequential combinator:

```typescript
let p = string("a").pipe(
    then("b")
);
```

And you give it input that makes the 1st parser succeed and the 2nd parser to fail.

```typescript
p.parse("ac");
// Hard failure at Ln 1 Col 2
// 1 | ac
//      ^expecting 'b'
// Stack: string < then
```

In this case, combinators like `or` will not work. Even if we added the `or` combinator to the above:

````typescript
// doesn't work, still fails

let p2 = p.pipe(
	or("ac")
);

p2.parse("ac");
````

This still results in the same failure as before. The idea behind this is that the input made the parser break an expectation. When the first parser for `"a"` succeeds, it convinces the `then` combinator that this really is the parser it's supposed to be using. When the parser for `"b"` fails, it sees it as a syntax error and not just an alternative input type.

The recommended way to solve this problem is to write parsers that quickly determine if the input is right for them, without having to apply multiple parsers and backtrack a non-constant amount to recover from a failure. For example, we could write the above parser like this:

```typescript
let example = string("a").pipe(
    then(
    	or("b")("c")
    )
);
```

This failure can also appear in other parsers. For example:

```typescript
let floatParser = float();

floatParser.parse("5.0e+hello");
```

Here we're using the `float()` parser to parse a floating-point number. We give it an input with a number in scientific notation, except the exponent is gibberish.  By the time the parser reached the exponent, it had already chosen to interpret it as a number in scientific notation, so the lack of a valid exponent breaks this expectation.

See the section below to learn about how to recover from a Hard failure if you really need to.

#### Fatal failure

This is an extra failure type which isn't emitted by Parjs by default, but you can build your own parsers to emit it. It won't be handled by any combinator and will cause parsing to fail. 

### Recovering from (most) failures

You can use the `recover` combinator to recover from non-Fatal failures. You can give it a handler that will be called if the parser it's used on fails, together with all the failure information. You can then alter the parser's result to something else or return nothing to signal nothing should change. The function will not be called if the parser succeeds.

Here is an example of it being used:

```typescript
let hardFailingParser = fail({kind: "Hard", reason: "who knows"});

let recovered = hardFailingParser.pipe(
	recover(failure => {
        if (failure.reason === "who knows") {
            return {
                kind: "OK",
                value: "some value to return"
            }
        }
    })
);
```

## User State

User state is a feature that can help you to parse complex languages, like mathematical expressions with operator precedence and languages like XML where you need to match up an end tag to a start tag.

Every time you invoke the `.parse` method Parjs creates a unique, mutable user state object. The object is propagated throughout the parsing process and some combinators and building block parsers can modify it or inspect it. The only information in it will be what you put inside it and it won't change how the rest of the library behaves.

The `.parse` method accepts an additional parameter `initialState` that contains properties and methods that are merged with the user state:

```ts
// p is called with a parser state initialized with properties and methods.
let example = p.parse("hello", {token: "hi", method() {return 1;});
```

The combinator `map` is a projection combinator. You can give it a function taking two parameters: the parser result and the parser state.

```typescript
let example = string("a").pipe(
	map((result, state) => state.flag)
);
```

`each` is a combinator that doesn't change the parser result, so you can use it to only modify the user state.

User state is a less idiomatic and elegant feature meant to be used together with, rather than instead of, parser results.

### Replacing user state

The combinator `replaceState` lets you *replace* the user state object, but only in the scope of the parser it applied to.

It creates a brand new user state object, merged with properties from the object you specify, and gives it to the parser. Once the parser is finished, the old user state object is restored. This means you will need to use that parser's result value to communicate out of it, and it serves the isolate other parsers from what happens inside.

Replacing user state is powerful, and can allow you to write recursive parsers that need a hierarchy of nested user states to work.

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