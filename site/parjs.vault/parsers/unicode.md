#stage-2 %%Core implementation and characteristics still unclear %%
This #🧩parser is a [[char parser]] that parses a single Unicode codepoint, or the sequence `\r\n`. 

Its **char set** is any such codepoint, or the sequence of codepoints `\r\n`. 

At present I’m undecided on core questions about Unicode parsing:
1. How much of the UCD to load, if any
2. Should I just parse with single-char regexes?
3. Use `unicode-trie`?
    1. How to load it? Async `fetch` or sync manually parsing hardcoded base64?
    2. Some other method?
4. Should there be a trie for each parser?
5. Use an interval tree?
6. Custom immutable trie data structure?
# [[base char class|base char classes]]
This is incomplete.

| ID                | Description                                                                                        | RegExp                   |
| ----------------- | -------------------------------------------------------------------------------------------------- | ------------------------ |
| **CLASS NAME**    |                                                                                                    |                          |
| `"letter"`        | `Letter/L`                                                                                         | `\p{L`                   |
| `"upper"`         | `Letter_Upper/Lu`                                                                                  | `\p{Lu`                  |
| `"lower"`         | `Letter_lower/Ll`                                                                                  | `\p{Ll`                  |
| `"numeric"`       | `Number/N`                                                                                         | `\p{N`                   |
| `"newline"`       | Characters that cause a line break based on [UAX14](https://www.unicode.org/reports/tr14/#Table1). | `\r\n\|[\n\r\x85\u2029]` |
| `"visible"`       | ???                                                                                                | ???                      |
| `"control"`       | The `Control/Cc` general category.                                                                 | `\p{Cc`                  |
| `"bmp"`           | A character in the BMP.                                                                            | `[\u0000-\uFFFF]`        |
| `"assigned"`      | Inverse of `Unassigned/Cn` GC.                                                                     | `(?!\p{Cn)[\s\S]`?       |
| `"ascii"`         | An ASCII character.                                                                                | `[\x00-\x7F]`            |
| **RANGE**         | **A range of codepoints**                                                                          |                          |
| `"[α-δ]"`         | Any of `α β γ δ`                                                                                   | `[α-δ]`                  |
| **LIST**          | **A list of characters**                                                                           |                          |
| `"(\r\n ℵ)"`      | A DOS line break or mathematical $\aleph$                                                          | `\r\n\|ℵ`                |
| **PROPERTY**      | **Characters with a Unicode property**                                                             |                          |
| `"@script=Greek"` | A character used in the Greek script.                                                              | `\p{scx=Greek`           |
| `"@block=Thai"`   | A character in the Thai block.                                                                     | `[\u0E00-\u0E7F]`        |
| `"@emoji"`        | Characters with the Emoji property                                                                 | `\p{Emoji`               |
| `"@gc=Pf"`        | The `Pf/Final Punctuation` GC                                                                      | `\p{gc=Pf`               |
| **NEGATION**      | **Negates another char class**                                                                     |                          |
| `"!@gc=Pf"`       | Any character not in the `Pf` GC                                                                   | `(?!\p{Pf)[\s\S]`?       |
