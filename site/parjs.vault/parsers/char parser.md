---
aliases:
    - char parsers
---
#stage-4
A char parser is a #🧩parser for parsing individual chars. All char parsers behave in mostly the same way.

1. [[char parser|char parsers]] always parse the input directly.
2. They always yield a string if they succeed.
3. Each one has two sets of characters.
    1. The **char set**, which is like a list of all the inputs the parser recognizes as being chars.
    2. The **char class**, which is a subset of the **char set** that *this parser instance* is configured to okay.
4. If they parse a character in their char class at the current position, they yield that character.
5. If they have more than one matching character, the will pick the longest one (based on its `length` property).
6. Otherwise, they [[signal/fail|⛔fail]].

The library offers two char parsers – [[ascii]] and [[unicode]]. Every instance of these parsers has the same **char set** — the char set is part of the logic of the parser itself – but will have different **char classes.**
# what’s a char?
Char parsers parse chars, but what’s a char? It’s just an element in that parser’s **char set**. In other words, it’s just a string the char parser can parse.

What this means is that each parser defines the meaning of _char_ for itself. Char parsers will sometimes produce strings of length `2` or higher as a _char_ because these strings count as chars according to its definition.

For instance, as far as the [[ascii]] parser is concerned, the only chars are ASCII characters, but with the DOS newline sequence tacked on. That is, given the string:

```
abc\n\n\n\r\n\r
```

It will be parsed as the chars:

```
a b c \n \n \n \r\n \r
```

As you can see from the ASCII parser, char parsers will always parse the longest (in terms of JavaScript `length`) character they okay.

For the [[unicode]] parser, a single char is any Unicode codepoint, which can be a string of length $2$ due to how JavaScript implements the standard. The DOS newline sequence is included there as well.

If a char parser encounters input it doesn’t recognize as a char — that is, *input outside its **char set*** — it will simply [[signal/fail]], such as in this example:
```ts
import {ascii} from "parjs"
ascii().parse("ℵ") // Fail!
```
# char classes
The **char class** is a subset of a parser’s **char set** that it’s configured to okay.

Although char parsers seem simple, they are actually quite complicated, as they allow fine-grained control over their char class.

This system works kind of like parsers and combinators, but with notable differences that make it more efficient, without the normal overhead of a [[parse graph]], and so that char parsers can perform optimizations other parsers can’t.

Char classes are constructed from  denoted as strings called [[base char class|class specifiers]], together with  [[tuner|tuners]] for boolean operations defined on the char parsers themselves.

Unlike with [[combinator|combinators]], where a parser has an [[parse graph|internal structure]] matching the way it was constructed, the only difference between char classes is which characters they okay. 

This means two char parsers that parse the same char class are functionally equivalent, no matter how they were constructed.

> [!tip] PROTIP
> The way in which a char parser was constructed may be stored as metadata for debugging purposes.
# constructing a char parser
Char parsers constructors always okay a single parameter, which is a [[base char class]] specifier.  

```ts
import { ascii, unicode } from "parjs";

const asciiLetter = ascii("letter");
const uniDigit = unicode("digit");
```
# constructing classes
Character classes can be combined using [[tuner|tuners]] defined and implemented by the char parser itself.
## and(…classes)
This modifier intersects the parser’s current char class with all of `classes`. Each argument can be either a [[base char class]] or another [[char parser]] instance of the same type, which represents the character class it parses.

```ts
// Parse a-z:
const az = ascii("[a-z]");

// Excludes w, x, y:
const noWXY = az.and("![w-y]");

// Excludes f:
const notF = hex.and("!(F)");

const excludingA = ascii("!(a)");
const notF_or_A = notF.and(excludingA);
```
## or(…classes)
This modifier expands the char class by adding to it all of `classes`. Each argument can be a [[#class specifier]] or another [[char parser]] instance of the same type, which represents its char class.

```ts
const letter = ascii("letter");

// Letter or digit:
const letterDigit = letter.or("digit");

// Allow some specific punctuation:
const somePunct = letterOrDigit.or("(. , ! ?)");
```
## not()
This [[tuner]] returns a parser with an inverted **char class**. That is, the returned parser okays all characters that are part of the [[parser|subject]]’s **char set** but not its **char class**.

```ts
const letter = ascii("letter");

const anythingButLetter = letter.not();
anythingButLetter.parse("1")
anythingButLetter.parse(",")
anythingButLetter.parse("!")
```

# reading strings
This [[tuner]], which exists on all [[char parser|char parsers]], produces a parser that reads a string of a fixed number of characters, where each char matches the char class of the parser. If it can’t, the parser [[signal/fail|⛔‍fails]]. 

```ts title:char-parser.read.ts

import {ascii} from "parjs"

ascii.read(3).parse("abc") // "abc"
```

The length is computed using the parser’s definition of a character, so the following will parse a string that has a JavaScript `length` of `3`.

```ts title:char-parser.read.crlf.ts
import {ascii} from "parjs"

ascii.read(2).parse("a\r\n") // "a\r\n"
```
# empty classes
It’s possible to construct a char parser that has an empty char class and so will always fail.

```ts
import { ascii } from "parjs";
// A character can't both a letter and a digit, so
// this char parser has an empty class:
const letterAndDigit = ascii("letter").and("digit");
```

