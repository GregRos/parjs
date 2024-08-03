---
aliases:
  - char classes
  - class specifiers
  - base char classes
---
#stage-4
[[char parser|char parsers]] accept chars based on their **char class**, which is constructed from [[char class|base char classes]], together with boolean operations on those classes. These base char classes are denoted using strings with a simple structure.

The two char parsers [[ascii]] and [[unicode]] don’t support the same base char classes, and when they do support a class they usually map it to a different set of characters. For example:
- [[ascii]] — `lower` means the lowercase ASCII characters `[a-z]`.
- [[unicode]] — `lower` means any codepoint in the `Letter_Lower` general category.

Character classes can also differ relative to each other.
- When using [[ascii]], `"letter"` is a combination of `"lower"` and `"upper"`.
- When using [[unicode]], `"letter"` includes characters that are neither lowercase nor uppercase.

Here is a table of recognized char classes, together with a description and notes indicating which parser supports what. See the parser documentation for a complete list and description of each char class that parser supports.
> ᵁ — Supported by [[unicode]]
> ᴬ — Supported by [[ascii]].

| Specifier        | Description                                                               |
| ---------------- | ------------------------------------------------------------------------- |
| **CLASS NAMEᴬᵁ** | **The name of a char class.**                                             |
| `"lower"`ᴬᵁ      | Lowercase letters.                                                        |
| `"upper"`ᴬᵁ      | Uppercase letters.                                                        |
| `"numeric"`ᴬᵁ    | Digits or number symbols.                                                 |
| `"letter"` ᴬᵁ    | Letters.                                                                  |
| `"hex"` ᴬ        | A hex digit, `[a-fA-F0-9]`                                                |
| `"newline"`ᴬᵁ    | Any sequence that moves to the next line.                                 |
| `"spaces"` ᴬᵁ    | Matches inline space characters.                                          |
| `"visible"` ᴬᵁ   | Visible characters.                                                       |
| `"control"` ᴬᵁ   | Invisible control chars.                                                  |
| `"base64"`ᴬ      | Matches base64 chars.                                                     |
| `"base64url"`ᴬ   | Matches URL-safe base64 chars.                                            |
| `"bmp"`ᵁ         | Matches any character in the Basic Multilingual Plane                     |
| `"assigned"`ᵁ    | Matches any assigned character.                                           |
| `"ascii"`ᵁ       | Matches ASCII characters.                                                 |
| **RANGEᴬᵁ**      | **A single range of characters.**                                         |
| `"[1-9]"`ᴬᵁ      | Characters between `1` and `9`.                                           |
| `"[a-f]"`ᴬᵁ      | Characters between `a` and `f`.                                           |
| **LISTᴬᵁ**       | **Any character in a list.**                                              |
| `"(a b c)"`ᴬᵁ    | Either `"a"`, `"b"`, or `"c"`                                             |
| `"(a)"`ᴬᵁ        | Special case for a list of length 1.                                      |
| **PROPERTY ᵁ**   | **Any character with a property.**                                        |
| `"@prop"`ᵁ       | Parses characters with the binary property `@prop`                        |
| `"@prop=val"`ᵁ   | Parses characters with a non-binary property `@prop` equal to `val`       |
| **NEGATIONᴬᵁ**   | **Negates another char class by prefixing it with `!`**                   |
| `"!(a b c)"`ᴬᵁ   | Any character except `"a"`, `"b"`, and `"c"`                              |
| `"!letter"`ᴬᵁ    | Any character except a letter.                                            |
| `"![1-9]"`ᴬᵁ     | Any character that’s not a digit.                                         |
| `"!@IDS`ᵁ        | Any character that doesn’t have the `IDS` or `ID_Start` Unicode property. |
# no escape
Specifier syntax doesn’t support or require escaping and has no concept of whitespace. For example, to match a range starting at `-` and ending at `]`, you simply write `[--]]`, which is unambiguous.

It’s unreadable to humans, but that can be fixed by using built-in character escapes, such as:

```ts
ascii("[\x2D-\x5D]")
```

Similarly, to match a list that includes a space, you simply write `"(a   b)`, which is again unambiguous. We can rewrite that using escape sequences too:

```ts
ascii("(a \x20 b)")
```
# multi-codepoint chars
Some char parsers recognize characters that are composed of multiple Unicode codepoints. 

Such characters don’t have a numeric index, so they can’t be used in the range specifier `[a-z]`. One example is `\r\n`.

However, they can still be used in the list specifier, as in `(a \r\n b)`. 
# inverting classes
Inverting a character class creates a new class that includes all characters except for the ones in the class. However, this set of *all characters* is always relative to the characters the char parser can recognize.

For example, the ASCII char parser does not recognize non-ASCII characters at all. When used with the class `!(a)`, it won’t allow parsing Unicode characters such as `≡` or `ℵ`, but will instead parse all other ASCII characters.
# adding new classes
There is room to expand class specifiers further. For instance, you could add a specifier that’s written `@prop>something` that checks that a numeric property is greater than a value. 

This could be used to match characters according to numeric Unicode properties, such as numeric value, width, and so on. 

You could also simply add additional named char classes you find useful. You should follow some rules while doing so, however.
## rules
1. **ASCII:** Specifiers should use ASCII for syntax elements.
3. **First char:** The first character of a specifier determines its type, and the second character can determine a subtype. 
4. **No escape:** Specifier shouldn’t have or need an escaping mechanism.
5. **No formatting:** Shouldn’t have non-functional elements like whitespace.
6. **Type checked:** Specifiers should be simple enough to type check using TypeScript.
# Parsing
Parsing a class specifier will be done with `parjs` itself, but carefully so that there are no circular dependencies.