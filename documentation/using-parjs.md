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

## Example workflow with a test runner

Working on your parser by writing tests is an interactive and fun way to develop. Here is a workflow that you can use:

1. Write your parser implementation in a file
2. Write a test file that imports the parser and tests it
3. Have a test runner that runs the tests and shows the results

    - You can use Jest, Vitest, Mocha, or any other test runner

Let's write a simple parser that parses a shopping list. The shopping list will have two sections: one for fruit and one for vegetables. Each section will have a list of items.

Start writing your parser implementation little by little:

```ts
// shopping-list.ts
import { string } from "parjs";
import { many1, manySepBy, or, recover, then } from "parjs/combinators";

export const fruitSection = string("Remember to buy ").pipe(
    then(string("apples").pipe(or(string("bananas"))))
);
```

Then write a test file that tests the parser:

```ts
// shopping-list.test.ts
import { type ParjsResult } from "parjs";
import { fruitSection, shoppingList, vegetablesSection } from "./shopping-list";

describe("fruitSection", () => {
    it("can parse apples", () => {
        const result: ParjsResult<["Remember to buy ", "apples" | "bananas"]> =
            fruitSection.parse("Remember to buy apples");
        // (^ you can leave out the explicit type in your test code)

        expect(result.isOk).toBe(true);
        expect(result.value).toEqual(["Remember to buy ", "apples"]);
    });

    it("can parse bananas", () => {
        // NOTE: if you are using jest, you can also simplify the testing logic by
        // importing the jest utilities that parjs uses internally. If you have any
        // issues, you can just fall back to the simple method described above.
        //
        // To do this, you need to add the following line to the top of your test
        // file:
        //
        // import "parjs/utilities";
        //
        // You can also add it to your test setup file, which is run before any
        // tests are executed.
        expect(fruitSection.parse("Remember to buy bananas")).toBeSuccessful([
            "Remember to buy ",
            "bananas"
        ]);
    });
});
```

Now you can run your tests with your test runner.

When you add more functionality, you can add more tests. You can also use the `.debug()` method to inspect the behaviour of your parser as described above. If your test runner executes the tests automatically, you can iterate on the parser very quickly.

Tip: If you have access to an AI assistant such as Github Copilot, you can use it to very quickly generate test cases. This is a great application of AI since the tests are very repetitive and self contained.
