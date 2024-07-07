#stage-2 %%Core implementation and characteristics still unclear %%
This #🧩parser is a [[char parser]] for parsing individual Unicode codepoints, or the sequence `\r\n`.

All values in the Unicode range `0x000000 -- 0x10FFFF` are supported, including both assigned and unassigned codepoints.
# async constructor
Unlike other parsers, which have a constructor function that immediately returns a parser object, the default [[unicode]] constructor instead returns a `Promise` that resolves into a parser.

This is because `parjs` needs to parse and load lots of Unicode data into memory for the parser to be constructed. This data is encoded as base64. Decoding it can take a long time in some cases. It’s better to perform the operation asynchronously if possible.

However, the operation only happens once.

```ts title:unicode.construction.ts
import {unicode} from "parjs"
const p = await unicode()
```

# [[char class|base char classes]]
🚧 **WORK IN PROGRESS** 🚧

| ID                | Description                                                               | RegExp                   |
| ----------------- | ------------------------------------------------------------------------- | ------------------------ |
| **CLASS NAME**    |                                                                           |                          |
| `"letter"`        | `Letter/L`                                                                | `\p{L}`                  |
| `"upper"`         | `Letter_Upper/Lu`                                                         | `\p{Lu}`                 |
| `"lower"`         | `Letter_lower/Ll`                                                         | `\p{Ll}`                 |
| `"numeric"`       | `Number/N`                                                                | `\p{N}`                  |
| `"newline"`       | Force line break @ [UAX14](https://www.unicode.org/reports/tr14/#Table1). | `\r\n\|[\n\r\x85\u2029]` |
| `"visible"`       | ???                                                                       | ???                      |
| `"control"`       | The `Control/Cc` general category.                                        | `\p{Cc}                  |
| `"bmp"`           | A character in the BMP.                                                   | `[\u0000-\uFFFF]`        |
| `"assigned"`      | Inverse of `Unassigned/Cn` GC.                                            | `(?!\p{Cn})[\s\S]?       |
| `"ascii"`         | An ASCII character.                                                       | `[\x00-\x7F]`            |
| **RANGE**         | **A range of codepoints**                                                 |                          |
| `"[α-δ]"`         | Any of `α β γ δ`                                                          | `[α-δ]`                  |
| **LIST**          | **A list of characters**                                                  |                          |
| `"(\r\n ℵ)"`      | A DOS line break or mathematical $\aleph$                                 | `\r\n\|ℵ`                |
| **PROPERTY**      | **Characters with a Unicode property**                                    |                          |
| `"@script=Greek"` | A character used in the Greek script.                                     | `\p{scx=Greek}`          |
| `"@block=Thai"`   | A character in the Thai block.                                            | `[\u0E00-\u0E7F]`        |
| `"@emoji"`        | Characters with the Emoji property                                        | `\p{Emoji}`              |
| `"@gc=Pf"`        | The `Pf/Final Punctuation` GC                                             | `\p{gc=Pf}`              |
| **NEGATION**      | **Negates another char class**                                            |                          |
| `"!@gc=Pf"`       | Any character not in the `Pf` GC                                          | `(?!\p{Pf})[\s\S]?`      |
Note that the `@script` property character class actually uses  both `Script_Extensions` and `Script`.
# unicode properties
A list of Unicode properties that can be matched using the `@prop=value` base char class. This is the default list; [[#loading options|fewer properties can be loaded]]. 

| Generate                                         |
| ------------------------------------------------ |
| Generate this table based on loaded Unicode data |
# loading options
Loading Unicode data can be customized using members from `parjs/unicode`.
## sync constructor
This import also contains a sync constructor for the parser, which you can use if you don’t have any other choice.

```ts title:unicode.import.ts
import {unicodeSync} from "parjs/unicode"
// This will load Unicode data synchronously, potentially blocking
// for a long time.
const p = unicodeSync()
```

## loading binary data
By default, the Unicode data `parjs` needs is encoded as base64 and embedded in the source code. This is the case even if the async constructor is used. However, there are some drawbacks with this approach.

1. `parjs` loads a relatively large dataset, which you might not actually need.
2. base64 is not space-efficient and parsing it is a bit redundant.

It’s possible to construct a custom Unicode dataset and load it as binary data instead. This can be achieved using the [[parjs construct-unicode]] script during development and the `configure `function.

```ts title:unicde.loader.ts
import {configure} from "parjs/unicode"
configure({
    loader: "binary",
    async load() {
        return fetch("/parjs.unicode.bin")
    }
})

```

This modifies how Unicode data is loaded globally. You’ll also need to implement a `loadSync` function if you want `unicodeSync` to work.
# Implementation
This [[char parser]] is implemented using a custom persistent array-mapped trie data structure, inspired by [UTrie](https://unicode-org.github.io/icu/design/struct/utrie), with individual bits as values. Each bit signifies whether a given Unicode codepoint is part of the [[char class]] or not.

The data structure has extensive support for sparse and range-based data and allows the [[unicode]] parser to recognize all values in the Unicode range, including both assigned and unassigned codepoints. 

It’s optimized for reading performance and construction from range data, but could use additional optimizations to improve write performance. 