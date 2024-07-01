# Parjs

![build](https://github.com/GregRos/parjs/actions/workflows/parjs.push.yaml/badge.svg)
[![codecov](https://codecov.io/github/GregRos/parjs/graph/badge.svg?flag=parjs)](https://codecov.io/github/GregRos/parjs?flags[0]=parjs)
[![npm](https://img.shields.io/npm/v/parjs)](https://www.npmjs.com/package/parjs)
[![Downloads](https://img.shields.io/npm/dm/parjs)](https://www.npmjs.com/package/parjs)
[![Gzipped Size](https://img.shields.io/bundlephobia/minzip/parjs)](https://bundlephobia.com/result?p=parjs)

**[🌍 ABOUT THIS REPOSITORY 🌍](#Repository)**

Documentation:

-   [API Documentation](https://gregros.github.io/parjs/)
-   [Using Parjs - Developer guide](/documentation/using-parjs.md)

Parjs a parser combinator library inspired by [Parsec](https://wiki.haskell.org/Parsec) and [FParsec](http://www.quanttec.com/fparsec/) (its F# adaptation), and written in TypeScript.

```bash
yarn add parjs
```

🍕 Lots of parsers!

⚙️ Lots of combinators!

💎 Lots of immutability!

🔍 Systematically documented!

🧐 Debugging features!

## What is it?

**PROTIP:** 🍕 is the universal symbol for _parser_.

Parser combinator libraries let you construct parsers from small parsers and combinators that transform those parsers by, for example, applying a parser multiple times in a row.

For example, you could have **a** parser `🍕"fi"` that parses the string `fi` and a combinator `⚙️exactly 2` that applies a parser exactly two times. Combining them lets you parse the string `fifi`!

```typescript
// 🍕string "fi" ➜ ⚙️exactly 2
string("fi").pipe(exactly(2));
```

Here is an example that constructs a parser that parses n-tuples of numbers like `(12.5, -1, 2)`, which is impossible using other parsing techniques<sup>citation needed</sup>.

```typescript
import { float, string, whitespace } from "parjs";
import { between, manySepBy } from "parjs/combinators";

// 🍕float
//  Parses a floating point number
const tupleElement = float();

//  🍕float ➜ ⚙️between 🍕whitespace
//  Parses a float between whitespace
const paddedElement = tupleElement.pipe(between(whitespace()));

//  🍕float ➜ ⚙️between 🍕whitespace ➜
//  ⚙️until fails, separated by 🍕","
//  Parses many floats between whitespace, separated by commas.
const separated = paddedElement.pipe(manySepBy(","));

//  🍕float ➜ ⚙️between 🍕whitespace ➜
//  ⚙️until fails, separated by 🍕"," ➜ ⚙️between 🍕"(" and 🍕")"
//  Parses many floats separated by commas and surrounded by parens.
const surrounded = separated.pipe(between("(", ")"));

//  Parses the string and print [1, 2, 3]
console.log(surrounded.parse("(1,  2 , 3 )"));
```

## Examples

Here are some more cool examples:

1. [tuple parser](./src/examples/tuple.ts) ([tests](./src/test/examples/tuple.spec.ts))
1. [.ini parser](./src/examples/ini.ts) ([tests](./src/test/examples/ini.spec.ts))
1. [JSON parser](./src/examples/json.ts) ([tests](./src/test/examples/json.spec.ts))
1. [Math expression parser](./src/examples/math.ts) ([tests](./src/test/examples/math.spec.ts))

## How does it work?

Parsers are called on an input via the `parse(input)` method and return a `result` object.

Parsers that succeed return some kind of value. While basic parsers return the parsed input (always a string), combinators (such as `map`) let you change the returned value to pretty much anything. It’s normal to use this feature to return an AST, the result of a calculation, and so on.

If parsing succeeded, you can access the `result.value` property to get the return value.

```typescript
const parser = string("hello world").pipe(map(text => text.length));
const result = parser.parse("hello world");
assert(result.value === 11);
```

However, doing this if parsing failed throws an exception. To check if parsing succeeded or not, use the `isOkay` property.

You can also use `toString` to get a textual description of the result.

```typescript
const result2 = parser.parse("hello wrld");
if (result.isOkay) {
    console.log(result.value);
} else {
    console.log(result.toString());
    // Soft failure at Ln 1 Col 1
    // 1 | hello wrld
    //     ^expecting 'hello world'
    // Stack: string
}
```

### Dealing with failure

`parjs` handles failure by using the SHF or 😕😬💀 system. It recognizes three kinds of failures:

-   😕 **S**oft failures — A parser quickly says it’s not applicable to the input. Used to parse alternative inputs.
-   😬 **H**ard failures — Parsing failed unexpectedly. Can only be handled by special combinators.
-   💀 **F**atal failure — Happen when you decide and tell the parser to [halt and catch fire](<https://en.wikipedia.org/wiki/Halt_and_Catch_Fire_(computing)>). They can’t be handled.

Parsing failures bubble up through combinators unless they’re handled, just like exceptions. Handling a failure always means backtracking to before it happened.

Some combinators can upgrade soft failures to hard ones (if it says so in their documentation).

Failing to parse something is a common occurrence and not exceptional in the slightest. As such, `parjs` won’t throw an exception when this happens. Instead, it will only throw exceptions if you used it incorrectly or there is a bug.

The `result` object mentioned earlier also gives the failure type via its `kind` property. It can be `OK`, `Soft`, `Hard`, or `Fatal`.

```typescript
console.log(result.kind); // "Soft"
```

#### The `reason` field

The parsing result also includes the important `reason` field which says why parsing failed and usually what input was expected.

This text appears after the `^` character in the visualization, but can also be used elsewhere. It can be specified explicitly in some cases, but will usually come from the parser’s `expecting` property.

#### 😕 **S**oft failures

> A parser quickly says it’s not applicable to the input.

You can recover from soft failures by backtracking a constant amount. These failures are used to parse alternative inputs using lots of different combinators, like `or`:

```typescript
// 🍕"hello" ➜ ⚙️or 🍕"goodbye" ➜ ⚙️or 🍕"blort"
// Parses any of the strings, "hello", "goodbye", or "blort"
const parser = string("hello").pipe(or("goodbye"), or("blort"));
```

#### 😬 Hard failure

> An unexpected failure that usually indicates a syntax error.

Hard failures usually indicate unexpected input, such as a syntax error. These failures bubble up through multiple parsers and recovering from them can involve backtracking any number of characters.

Most hard failures were soft failures in an internal parser that weren’t handled, and got upgraded by a combinator. After this happens, combinators like `⚙️or` that recover from soft failures no longer work.

Sequential combinators tend to do this a lot if a parser fails late in the sequence. For example:

```typescript
// 🍕"hello " ➜ ⚙️and then, 🍕"world" ➜ ⚙️or 🍕"whatever"
// Parses the string "hello " and then the string "world"
// or parses the string "hello kittie"
const helloParser = string("hello ").pipe(
    then(
        // If this parser fails, ⚙️then will upgrade
        // it to a 😬Hard failure.
        string("world")
    ),
    // The ⚙️or combinator can't recover from this:
    or("hello kittie")
);

console.log(helloParser.parse("whatever").toString());
// Hard failure at Ln 1 Col 6
// 1 | hello world
//           ^expecting "world"
// Stack: string < then < string
```

To avoid this situation, write parsers that quickly determine if the input is for them, and combinators like `or` that will immediately apply a fallback parser instead.

```typescript
const helloParser2 = string("hello ").pipe(
    then(
        // The 😕Soft failure in the 🍕"world" parser
        // is handled immediately using ⚙️or
        // so it doesn't reach ⚙️then
        string("world").or("kittie")
    )
);
```

However, sometimes hard failures are inevitable or you can’t be bothered. In those cases, you can use `⚙️recover` which lets you downgrade the failure or even pass it off as a success.

```typescript
// Let's do the same thing as the first time:
const helloParser3 = string("hello ").pipe(
    // ⚙️then will fail 😬Hard, like we talked about:
    then(string("world")),
    // But then the ⚙️recover combinator will downgrade the failure:
    recover(() => ({ kind: "Soft" })),
    // So the ⚙️or combinator can be used:
    or("kittie")
);
```

However, code like this is the equivalent of using `try .. catch` for control flow and should be avoided.

The `⚙️must` combinator, which validates the result of a parser, emits **😬 Hard** failures by default.

#### 💀 Fatal failures

A **💀 Fatal** failure is the parsing equivalent of a Halt and Catch Fire instruction and can’t be recovered from – in other words, they cause the overall parsing operation to fail immediately and control to be returned to the caller.

They act kind of like thrown exceptions, except that **parsers don’t throw exceptions for bad inputs.**

`parjs` parsers will never fail this way unless **you** explicitly tell them to. One way to do this is using the `fail` basic parser. This parser fails immediately for any input and can emit any failure type.

```typescript
const parser = fail({
    kind: "Fatal"
});

console.log(parse.parse("").toString());
```

## Cool features

### Immutability

In `parjs`, parsers are functionally immutable. Once a `parjs` parser is created, it will always do the same thing and can never change. I mean, **you** could do something like this:

```typescript
// 🍕"hello world" ➜ predicate `() => Math.random() > 0.5`
string("hello world").pipe(must(() => Math.random() > 0.5));
```

But then it’s on **you**. And _you know what you did._

### Unicode support

JavaScript supports Unicode strings, including **”抱き枕”**, **”כחול”**, and **”tủ lạnh”**. Those characters aren’t ASCII – most of them have character codes in the low thousands.

That doesn’t matter if you’re parsing a specific string, since it ends up being a binary comparison, but it definitely does if you’re trying to parse 4 _letters_, a broad Unicode category that includes thousands of characters.

Luckily, `parjs` has got you covered. Parsers such as `letter`, have Unicode versions – `uniLetter`. These Unicode versions use the package [`char-info`](https://www.npmjs.com/package/char-info) to figure out if each character is a letter or not.

This probably involves a lookup in some complicated data structure for each potential letter.

```typescript
// 🍕ᵘLetter
// Parses any unicode letter
const pNameChar = uniLetter();

// 🍕ᵘLetter ➜ ⚙️until it fails
// Parses any number of unicode letterss
const pName = pNameChar.pipe(many());

// 🍕"שלום שמי " ➜ ⚙️and then, 🍕ᵘLetter ➜ ⚙️until it fails
const greeting = string(`שלום שמי `).pipe(qthen(pName));

assert(greeting.parser("שלום, שמי גרג").value === "גרג");
```

### Shorthand for literal parsers

**Parsers accept strings**, but **combinators accept other parsers**. This is to make sure they’re as general as possible. However, in practice, a lot of their inputs are going to be stuff like `string(“hello”)`.

`parjs` knows about this, and will automatically convert string literals into parsers that parse those literals.

```typescript
// 🍕"ice " ➜ ⚙️and then, 🍕one or more spaces
// ➜ ⚙️and then, the regexp /\s*baby/
string("ice").pipe(
    thenq(spaces1()),
    then("ice"), // Implicitly: string("ice ")
    then(/\s*baby/) // Implicitly: regexp(/\s*baby/)
);
```

#### Constant type inference

If you're using TypeScript, you may want to keep using `string("world")` instead of `"world"`. This is because the former will infer the type of the parser to be `Parjser<"world">`, while the latter will infer it to be `Parjser<string>`.

Here's an example of the difference:

```typescript
// This will infer "world" to the constant type of "world"
const parser: Parjser<["hello", "world"]> = string("hello").pipe(then(string("world")));

// This will infer to the string type, which may be more confusing to debug, and
// have issues with type aliases
const parser: Parjser<["hello", string]> = string("hello").pipe(then("world"));
```

### Debugging

> 🆕 new in version `1.0.0`

The `.debug()` method is a powerful tool for debugging parsers in your code.

When you call `.debug()` on a parser, it enables debug mode for that parser (and returns itself). In debug mode, the parser logs detailed information about its operation, which can help you understand how it's processing the input and where it might be going wrong.

Here's an example of how to use it:

```typescript
const parser: Parjser<"a"> = string("a").expects("an 'a' character").debug();

// when you execute the parser:
parser.parse("a");

// it will console.log() something like this:
//
// "consumed 'a' (length 1)
// at position 0->1
// 👍🏻 (Ok)
// {
//     "input": "a",
//     "userState": {},
//     "position": 1,
//     "stack": [],
//     "value": "a",
//     "kind": "OK"
// }
// {
//     "expecting": "an 'a' character",
//     "type": "string"
// }"
```

When you execute this parser, it will log information about how it's trying to match "hello" in the input.

Remember that `.debug()` affects only the parser it's called on. If you have a complex parser built from many smaller parsers and you call `.debug()` on the complex parser, it won't enable debug mode for the smaller parsers. If you want to debug the smaller parsers, you need to call `.debug()` on each of them. This way you can customize the debugging output to show only the information you need.

### User state

User state can help you to parse complex languages, like mathematical expressions with operator precedence and languages like XML where you need to match up an end tag to a start tag.

Every time you invoke the `.parse` method `parjs` creates a unique, mutable user state object. The object is propagated throughout the parsing process and some combinators and building block parsers allow you to modify it or inspect it. It’s called _user_ state because the library will never modify it by itself.

The `.parse` method accepts an additional parameter `initialState` that contains properties and methods that are merged with the user state:

```typescript
// p is called with a parser state initialized with properties and methods.
let example = p.parse("hello", {token: "hi", method() {return 1;});
```

The combinator `map` is a projection combinator. You can give it a function taking two parameters: the parser result and the parser state.

```typescript
let example = string("a").pipe(map((result, state) => state.flag));
```

`each` is a combinator that doesn't change the parser result, so you can use it to only modify the user state.

#### Replacing user state

The combinator `replaceState` lets you _replace_ the user state object, but only in the scope of the parser it applied to.

It creates a brand new user state object, merged with properties from the object you specify, and gives it to the parser. Once the parser is finished, the old user state object is restored. This means you will need to use that parser's result value to communicate out of it, and it serves the isolate other parsers from what happens inside.

Replacing user state is powerful, and can allow you to write recursive parsers that need a hierarchy of nested user states to work.

## Writing a parser with custom low-level logic

In most cases, you should use the existing parsers and combinators to write your parser. You shouldn't automatically write a custom parser like this.

Writing a parser with totally custom logic lets you read the input and manage the position directly. This can allow you to implement new kinds of building-block parsers. While Parjs is meant to be easily extensible, this API will probably change more than more outward facing APIs, so be warned.

### Parser flow

When parsing, a unique mutable `ParsingState` object is created. This object has the following shape:

```typescript
interface ParsingState {
    readonly input: string;
    position: number;
    value: unknown;
    userState: UserState;
    reason: string;
    kind: ReplyKind;
    //...
}
```

Each parser gets handed this object and needs to mutate its properties to return information and change the position.

The `kind`, `value`, and `reason` properties are used to send data out of the parser.

1. The `kind` gives the result type: success, failure, and which type of failure.
2. `value` is used to output the parser result. It must be assigned if the `kind` is `OK`, and must not be assigned otherwise.
3. `reason` is used to communicate the reason for an error, if any. You should only set it in case of an error. If you don't set it and signal an error, the `expecting` field in your parser object will be used as the error.

You can modify the other properties too, except for `input` which you almost certainly should not modify.

### Creating the parser

To create a custom `Parjs` parser you need to extend the class `ParjserBase`, which you import from `parjs/internal`.

-   Override the `_apply` method to set the logic of the parser (this method is the one that takes the parsing state above).
-   You also need to set `expecting` which is a default error string the parser will use in case of error.
-   Finally, set the `type` string of the parser. This string is used to identify the parser and isn't only for informational purposes. It could be used in things like optimizations for example.

Here is a simple implementation of the `eof` parser, which detects the end of the input. Add type annotations as desired.

```typescript
import { ParjserBase, ParsingState } from "parjs/internal";

/**
 * Returns a parser that succeeds if there is no more input.
 *
 * @param result Optionally, the result the parser will yield. Defaults to undefined.
 */
export function eof<T>(result?: T): Parjser<T> {
    return new (class Eof extends ParjserBase<T> {
        type = "eof";
        expecting = "expecting end of input";

        _apply(ps: ParsingState): void {
            if (ps.position === ps.input.length) {
                ps.kind = ResultKind.Ok;
                ps.value = result;
            } else {
                ps.kind = ResultKind.SoftFail;
            }
        }
    })();
}
```

# Repository

There are a number of systems to help organize the monorepo, run commands, build, develop, and test things conveniently. Let's look at them.

### VS Code Workspace

Opening the file `parjs.code-workspace` in VS Code lets you work on any and all of the packages inside the repository. This workspace has three **workspace roots:**

-   **parjs** at `/packages/parjs`
-   **char-info** at `/packages/char-info`
-   **root** at `/`, but excluding the packages folder.

Here is how it looks on my highly customized installation:
<img src="https://github.com/GregRos/parjs/assets/1788329/5f205e09-e941-4090-abfd-a56aa45e2ae8" width=300>

### Yarn Workspaces

The yarn root `/package.json` has four [yarn workspaces](https://yarnpkg.com/features/workspaces) with a `package.json` each:

-   `/packages/parjs`
-   `/packages/char-info`
-   `/packages/parjs/examples`
-   `/packages/char-info/examples` 👈this is unused

#### Examples Workspaces

I made the examples folders separate workspace so they can import the package by name, instead of using relative imports, but so that within the repo it will still link to the current codebase.

#### Executing commands

Commands can be executed with `yarn` normally by going into a workspace root like `packages/parjs`.

However, you can also use the [workspace](https://yarnpkg.com/cli/workspace) and [workspaces](https://yarnpkg.com/cli/workspaces/foreach) action groups to execute commands on multiple packages. For example:

```bash
yarn workspaces foreach -A run clean
```

To execute a command on a single workspace, you can use, for example:

```bash
yarn workspace parjs run build
```

#### Adding dependencies

If you run the following in the repo root, you'll add the package to the workspace:

```bash
yarn add X
```

This means it won't be a dependency of any of the packages inside it, but rather something that comes with this repo.

-   If it's a dev dependency, this is usually what you want right now.
-   If it's not, it's usually **not** what you want.

#### Adding dependencies in child workspaces

One way to run commands or add dependencies is to `cd` into a folder with a `package.json` and run a normal `yarn` command there.

```bash
cd packages/parjs
yarn run build
```

You can also use yarn's CLI. To add a dependency to a specific package:

```bash
yarn workspace parjs add -D npm-run-all
```

If you instead want to add it to all packages:

```bash
yarn workspaces foreach -A add -D npm-run-all
```

In this case, it's a dev dependency. It seems to be needed in each package.

### TypeScript Projects

| Symbol | Meaning                                                                                   |
| ------ | ----------------------------------------------------------------------------------------- |
| 🏭     | `tsconfig.json` that compiles and emits JavaScript.                                       |
| 🚀     | `tsconfig.json` that doesn't emit for tests that should be run with `ts-node` or similar. |
| 🔗     | `tsconfig.json` that only has references to other projects and no files.                  |

TypeScript project at 🔗`/tsconfig.json`, referencing:

-   🔗 `/packages/parjs/tsconfig.json`, referencing
    -   🏭 `/packages/parjs/src/tsconfig.json`
    -   🚀 `/packages/parjs/spec/tsconfig.json`
    -   🔗 `/packages/parjs/examples/tsconfig.json`, referencing
        -   🏭 `/packages/parjs/examples/src/tsconfig.json`
        -   🚀 `/packages/parjs/examples/spec/tsconfig.json`
-   🔗 `/packages/char-info/tsconfig.json`, referencing
    -   🏭 `/packages/char-info/src/tsconfig.json`
    -   🏭 `/packages/char-info/spec/tsconfig.json

🏭 and 🚀 tsconfigs extend `/tsconfig.base.json`, which allows it to configure compilation for the whole project. The only other properties in the different `tsconfig`s are project-specific and set `noEmit`, `composite`, `paths`, and so on. There are no meaningful overrides.d

**The whole repo can be watched using a single `tsc -b -w` at the root of the repository.** That is how `yarn run watch` works.

# Megamap

The structure of the entire monorepo.

| Syntax  | Meaning                 |
| ------- | ----------------------- |
| **👈X** | extends X               |
| **🖇X** | references X            |
| **⇶X**  | emits to X              |
| **⇶∅**  | no emit                 |
| 🏭      | emitting tsconfig       |
| 🚀      | ts-node tsconfig        |
| 🌲      | reference-only tsconfig |

```bash
parjs/
├── packages/
│   ├── parjs/
│   │   ├── src/
│   │   │   └── 🏭 tsconfig.json 👈/tsconfig.base.json ⇶../dist
│   │   ├── spec/
│   │   │   └── 🚀 tsconfig.json 👈/tsconfig.base.json ⇶∅
│   │   ├── (dist)/
│   │   │   └── (compiled from ../src)
│   │   ├── examples/
│   │   │   ├── src/
│   │   │   │   └── 🏭 tsconfig.json 👈/tsconfig.base.json ⇶../dist
│   │   │   ├── spec/
│   │   │   │   └── 🚀 tsconfig.json 👈/tsconfig.base.json ⇶∅
│   │   │   ├── (dist)/
│   │   │   │   └── (compiled from src)
│   │   │   └── 🔗 tsconfig.json 🖇src 🖇spec
│   │   ├── 🔗 tsconfig.json (🖇src 🖇spec 🖇examples) ⇶∅
│   │   ├── jest.config.mjs 🖇spec 👈/jest.root.mjs
│   │   ├── package.json
│   │   └── README.md // parjs readme
│   │
│   └── char-info/
│       ├── src/
│       │   └── 🏭 tsconfig.json 👈/tsconfig.base.json ⇶../dist
│       ├── spec/
│       │   └── 🏭 tsconfig.json 👈/tsconfig.base.json ⇶../dist-spec
│       ├── (dist)/
│       │   └── (compiled from ../src)
│       ├── (dist-spec)/
│       │   └── (compiled from ../spec)
│       ├── examples/ // unused
│       │   └── ...
│       ├── package.json
│       ├── 🔗 tsconfig.json 🖇spec 🖇src
│       └── README.md // char-info readme
│
├── tsconfig.base.json // all emitting tsconfigs extend from this
├── 🔗 tsconfig.json 🖇packages/{char-info,parjs}/tsconfig.json
├── package.json // workspace package.json file
├── (linting configurations)
├── jest.root.mjs // base jest configuration
├── yarn.lock // workspace yarn.lock file
├── README.md // monorepo readme
├── parjs.code-workspace
└── .git*
```

###
