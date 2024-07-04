# Unicode Graph

!!!THIS PACKAGE IS UNTESTED RIGHT NOW!!!
This package fetches data from the Unicode Character Database (UCD), parses its tabular format, and returns an object model of that data.

# Installation

```bash
yarn add unicode-info
```

# Usage

```ts
import { fetchUnicodeGraph } from "unicode-info";

const graph = await fetchUnicodeGraph({
    version: "15.1.0", // Which version of Unicode to fetch
    // what to index and load into memory
    dataFlags: ["char:name", "char:prop:val", "props:ucd"]
});
for (const arrow of graph.block("Arrows")) {
    console.log(arrow.name);
}
```

# Data model

The Unicode dataset has three kinds of entities:

-   Codepoints --- Represented using `UnicodeCharacter` objects
-   Properties --- Represented using `UnicodeProperty` objects.
-   Values --- Represented using `UnicodeValue` objects.

A Property is kind of like an edge that links a Codepont and a Value. A codepoint has up to a single value for all ordinary properties. For example,

1. `Block` is a property that gives a codepoint's Unicode block. Each codepoint is part of one block, and there are around 350 blocks.
2. `Emoji` is a boolean property that only has one value

However, the `General_Category` and `Script_Extensions` properties work differently.

This also means that each Property has a fixed number of Property Values. For example,

Properties and property values can each have any number of aliases. With

Each codepoint has one value for a given property, with the exception of _script extensions_ that just works completely different.

This model starts with `UnicodeGraph` object. Its primary children are `UnicodeCharacter` objects, accessible via `graph.chars`, and `UnicodeProperty` objects, accessible via `graph.props`.

Each `UnicodeProperty` has a set of possible values, represented as `UnicodeValue` objects. Each `UnicodeValue` object contains a set of codepoint ranges that has that value.

Properties and values both have aliases, sometimes many of them. Each object contains a list of its respective aliases.

Codepoints have a single value for each Unicode property, if any, with the exception of `Script_Extensions`. That property allows more than one value and has a special representation.

This data doesn’t use any kind of clever encoding and is largely stored using hash maps.

At the same time, what it lacks in efficiency it makes up for in completeness and selectivity. You can choose which parts of the Unicode data set you want to load into memory, and this choice will be reflected in the types you’ll be working with.

Currently the package doesn't support the Unihan part of the UCD, which includes a massive amount of data about CJK characters and other codepoints.

## Data flags

You choose which parts of the Unicode data set to load using **data flags**. These are just strings that tell the package what data you want to load into memory.

Data flags are strongly typed and their presence adds additional members to the types you're working with. That means that the `"char:names"` data flag adds the `name` property to `UnicodeCharacter` objects. Without it, they won't have this property.

The minimum level of data includes the basic Unicode properties `Script`, `Script_Extensions`, `Block`, and `General_Category`, together with codepoint ranges for each value for these properties.

Without additional data flags, property values for each character aren't indexed by default, and querying the property value for a character can take potentially $O(n)$.

1. `"props:ucd"` --- Includes all properties appearing in the UCD, with the exception of `Unihan.zip`.
2. `"char:name"` — Stores codepoint names indexed by their IDs. Codepoint names are long strings, so this is the most memory-expensive data flag.
3. `"char:prop:val"` --- Indexes property values by codepoint. This makes property lookups $O(1)$.

This package doesn’t do any tricky encoding of that data, simply using `Map` collections for everything, optimizing just enough to make the data set merely huge rather than gargantuan.

## Property value model

Unicode consists of _codepoints_ and _properties_, where some codepoints have a specific _value_ for a given _property_.

So for example, `General_Category` or `gc` is a property, and that property's value for the character `'A'` is `Lu` or `Letter_Upper`.

As you can see, most properties and values in Unicode have more than one name or alias. `unicode-info` keeps track of this by giving `UnicodeProperty` objects a `names` property and `UnicodeValue` a `values` property.

In addition, the package keeps track of the `shortName` and `longName` of each property, a shortest name and a longest name.

However, there are also some more exotic constructs that are needed to fully explain this system --- namely, _unions_. These are combinations of multiple values.

Unions appear in the `General_Category` property. While each codepoint has exactly one value of `General_Category`, some values are allowed to stand in for one of a set of values.

For example, the value `L` or `Letter` is actually a combination of `Lu | Lo | Lt | Ll`. While no codepoint has that value, some codepoints have

Unions primarily appear in the `General_Category` property. They have single-letter names such as `C` or `L` and correspond to a union of multiple property values. For instance, `L` corresponds to

Intersections appear in the `Script_Extensions` property, which allows for characters to have multiple scripts. Unlike in other cases, the intersection `@Scx=Arab` and `@Scx=Coptic` is not empty
