# char-info

![build](https://github.com/GregRos/parjs/actions/workflows/char-info.push.yaml/badge.svg)
[![codecov](https://codecov.io/github/GregRos/parjs/graph/badge.svg?flag=char-info)](https://codecov.io/github/GregRos/parjs?flags[0]=char-info)
[![npm](https://img.shields.io/npm/v/char-info)](https://www.npmjs.com/package/char-info)
[![Downloads](https://img.shields.io/npm/dm/char-info)](https://www.npmjs.com/package/char-info)
[![Gzipped Size](https://img.shields.io/bundlephobia/minzip/char-info)](https://bundlephobia.com/result?p=char-info)

A library that gives you information about individual Unicode characters. It also provides a list of Unicode groupings and their names, including lists of categories, blocks, and scripts. This is also reflected in the library's type definition files.

You can use for stuff like:

1. Find out what language a character is in, such as Greek (α), Latin (a), Hebrew (א), and so on.
2. Whether it's a kind of punctuation, digit, letter, emoji, spacing mark, or something else
3. What Unicode character block it inhabits
4. If it's upper-case or lower-case

The library only supports characters in the BMP. There are no plans to expanding it beyond the BMP.

In addition, the library provides basic ASCII character indicator functions, such as `isLetter`, `isUpper`, and so forth. These have really simple implementations and don't have the overhead of the Unicode indicators.

The library comes bundled with Unicode character information tables that originally came from the Unicode Character Database. This data can make bundles with the library being quite heavy. To counteract this, the library is built to leverage "tree shaking" or dead code elimination, which is used in all modern bundlers. Provided you only import the members you'll use, only some of the data will end up in your bundle. For example, if you just import the ASCII character indicators your bundle won't contain any Unicode data at all.

Enabling dead code elimination may require switching to ES2015 native modules. You'll need to look at your bundler's documentation for more information.

## Imports

The package has three paths you can import from:

1. `char-info/ascii`, which contains indicator functions for ASCII characters and character codes.
2. `char-info/unicode`, which contain the special Unicode character indicators.
3. `char-info`, which re-exports everything.

If you're using a properly configured bundler, you can import what you need from `char-info` and still take advantage of tree shaking.

## Usage - ASCII indicators

```typescript
import {isLetter, isUpper, isUpperCode} from "char-info"

assert.isTrue(isLetter("a"));
assert.isTrue(isUpper("A"));
assert.isTrue(isUpperCode("A"));

// You can also do it like this:
import * as AsciiInfo from "char-info/ascii";

assert.isTrue(AsciiInfo.isLetterCode("a".charCodeAt(0));

```

## Usage - Unicode Indicators

Unicode indicators work a bit differently, and aren't just plain functions. Instead, each indicator has two members, `char` and `code`, for testing characters (in the form of strings) and character codes, respectively.

```typescript
import { uniIsLetter, uniIsDigit } from "char-info";

assert.isTrue(uniIsLetter.char("א"));
assert.isTrue(uniIsDigit.char("٩"));
```

# Performance

According to internal testing, this library current performs over twice as fast as applying Unicode regexes to individual characters.
