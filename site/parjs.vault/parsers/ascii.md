#stage-4
This #🧩parser is a [[char parser]] that parses a single ASCII character, or a single DOS newline sequence, which it also regards as a character. 

This gives it a **char set** of 129 characters.

Internally, this parser creates a bit array of 128 bits, with each bit indicating whether a character is allowed. The operations `or` and `and` manipulate this set of bits using binary operations. Whether the parser will parse a DOS newline is a separate boolean.

This also means it inherently can’t parse anything except ASCII.
# [[char class|base char classes]]
This parser recognizes the following base char classes.

| ID             | Description                          | RegExp           |
| -------------- | ------------------------------------ | ---------------- |
| **Class Name** | **What it means**                    | **Re**           |
| `"letter"`     | ASCII letter                         | `[a-zA-Z]`       |
| `"upper"`      | Uppercase ASCII letter               | `[A-Z]`          |
| `"lower"`      | Lowercase ASCII letter               | `[a-z]`          |
| `"numeric"`    | ASCII digit                          | `[0-9]`          |
| `"hex"`        | ASCII hex digit, upper or lowercase. | `[0-9a-fA-F]`    |
| `"base64"`     | base64 character.                    | `[A-Za-z0-9+/=]` |
| `"base64url"`  | URL-safe base64 character.           | `[A-Za-z0-9_-]`  |
| `"control"`    | Invisible control characters.        | `[\x00-\1F\7F]`  |
| `"space"`      | A space character, `" "`             | `[ ]`            |
| `"spaces"`     | A tab or a space.                    | `[\t ]`          |
| `"newline"`    | Any newline sequence.                | `\r\n\|[\r\n]`   |
| `"visible"`    | The same as `"control"`              | `[\x00-\1F\7F]`  |
| **Range**      | **A range of characters.**           |                  |
| `"[a-z]"`      | The range between `a` and `z`        | `[a-z]`          |
| **List**       | **A list of characters**             |                  |
| `"(a b c)"`    | Either `a`, `b`, or `c`              | `[abc]`          |
| **Negation**   | **Negates another char class**       |                  |
| `"!letter"`    | Any character besides a letter.      | `[^a-zA-Z]`      |
| `"!(a b c)"`   | Any char other than `a` `b` `c`      | `[^abc]`         |
| `"![a-d]`      | Any char not between `a` and `d`     | `[^a-d]`         |
This parser doesn’t support property base classes, written `"@prop"` or `"@prop=val"`.