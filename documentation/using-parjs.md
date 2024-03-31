# Using Parjs

This file describes workflows that can be used to work with Parjs.

## Inspecting the behaviours of parsers with `.debug()`

The [debug() method](https://gregros.github.io/parjs/interfaces/index.Parjser.html#debug) can be called on any parser (even for the building blocks inside a complex parser!). It will return the parser unchanged, but it will log information about the parser to the console. This works well when you want to inspect what a parser does.

Here is an example using the `product` parser from the [math example](../src/examples/math.ts):

```ts
// simplified example
import { product } from "../../examples/math";
expect(product().debug().parse("1 * 2 ")).toBeSuccessful(expected);
```

It will log something like this to the console:

```ts
consumed '1 * 2 ' (length 6)
at position 0->6
👍🏻 (Ok)
{
  "input": "1 * 2 ",
  "userState": {},
  "position": 6,
  "stack": [],
  "value": {
    "lhs": {
      "value": 1
    },
    "operator": "*",
    "rhs": {
      "value": 2
    }
  },
  "kind": "OK",
  "reason": "expecting '*' OR expecting '/' OR expecting '%'"
}
{
  "type": "map",
  "expecting": "product"
}
```

This will help you see:

-   The input that was consumed
-   The position in the input
-   The value that was parsed (returned by the parser)
