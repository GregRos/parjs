---
aliases:
  - subject
  - terminator
  - separator
---
#stage-3
> [!note] This is a development guide rather than documentation.

A #🧩parser  is an object that parses text and returns a result. In addition, parsers may also define [[tuner|tuners]] that configure the parser instance without adding to the [[parse graph]].

In Parjs, parsers are assignable to the interface `Parjser<R>`. However, they’re not classes, so the `implements` mechanism is not used for this purpose.

```ts title:parser.parjser.ts
import {core } from "parjs/internal"
export interface Parjser<R> {
    readonly [core]: ParjserCore<R>
    parse(input: string): R
    safeParse(input: string): Result<R>
    pipe(...): ...
    // If parjs/compatibility has been imported:
    oldParse(input: string): OldResult<R>
    
}
```

# TypeScript type of a parser
Unlike in v1, parsers are strongly-typed. So a combinator such as [[many]] will return a parser of the type `Many<R>` rather than `Parjser<R[]>` or similar. [[tuner|tuners]] may return different types than the base parser.

The types of parsers are expected to use TypeScript to its fullest extent, using all available type information to provide the best experience for the user.

For example, the boosters [[many#min]] and [[many#max]] are expected to narrow the parser’s return type from `R[]` to an array with the correct range of elements.

- In the case of `min`, this would be a tuple with at least `N` elements where `N` is the input length.
- In `max,` this would be a tuple with at most `N` elements – a union between `[]`, `[R]`, `[R, R]`, and so on.
- If both are specified, it would be a tuple with a specific number of elements.

# The parser core
Parjs parsers delegate implementation to a [[parser core]], and in fact the publicly visible parser is just a wrapper around that core, adapting the core’s less convenient API to be consumed by users.

This wrapper is also expected to provide user-facing such as:
1. Formatting error messages
2. Visualizing the [[parse trace]] and [[capture trace]].

There is a division of responsibility between the [[parser core]] and the API wrapper. This is to make writing [[custom parser|custom parsers]] easier, as users will only need to implement the parser’s logic and allow the library to provide those other services.

Alternatively, users can create a custom wrapper type and use it with the built-in [[parser core|parser cores]]. 

These benefits will of course also apply to library development and maintenance. People who just want to work on parsers will be able to do that, while people who want to improve the interface can work on the wrappers instead.

# Core VS type
Because of those two design decisions, parsers will in practice need to completely separate interface and implementation. The implementation of a parser would reside in the [[parser core]], while the interface will be a separate type alias.

To construct a parser object:
1. First the [[parser core]] would be constructed.
2. Then the wrapper object would be constructed based on the members found in the [[parser core]]. Proxies should not be used as they interfere with debugging.
3. Finally, the wrapper would be type asserted using the type alias for that parser.

This setup requires tests to be used to make sure the interface matches the implementation, but those have to be written anyway.

Ideally, it would be possible to construct the [[parser core]] and create a type alias that constructs the API wrapper type based on it. However, this is likely impossible because TypeScript has trouble abstracting over type parameters, and these constructions would involve lots of generic types and methods.

