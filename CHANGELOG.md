# Changelog

This project follows semantic versioning.

## 1.0.0

### Breaking changes

-   the `maybe` combinator's return type changed from returning `T` to `T | undefined`
-   (internal) remove internal namespaces with flat types. `ResultKind.Fail` is now called `ResultKindFail` and so on.
-   added additional type safety (some details available in a1e925bd782a714c28e1fa49ec2cb2792a80ab88)

### New features

-   add `isParjsSuccess`, `isParjsFailure`, `isParjsResult`. They can be used when testing your parsers.
-   add example parser for `.ini` files (see the [README](./README.md))
-   add example parser for mathe expressions (see the [README](./README.md))
-   the `or()` combinator shows a clearer error message when it fails
-   add the `.many1()` combinator, which is like `.many()` but requires at least one match
-   add `.debug()` method for any parser. It will log the parser's name, the input, the result, and the remaining input. This is useful for debugging. See the [README](./README.md) for more details.
-   add constant type inference for many parsers and combinators. For example, `const p: Parjser<"a"> = string("a")` is now the default inferred type when using `string()`. Previously, the type would be inferred as `Parjser<string>`. See the [README](./README.md) for more details.
-   failure stack traces are printed on multiple lines
