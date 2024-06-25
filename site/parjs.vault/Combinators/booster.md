---
aliases:
  - boosters
---
#stage-2
A #🚀booster  is an instance method on a combinator that lets you configure it.
## Adding input parsers
The [[or]] combinator lets you apply alternative parsers until one [[‍‍‍‍‍‍‍okay|‍‍‍‍‍‍‍✅‍okays]]. It has the [[or#or]] booster, which lets you add additional alternatives to its original set.

```ts title:combinators.boosting.alts.ts
import {or} from "parjs"

int.pipe(
    or("a string").or("another string")
).parse("another string") // "another string"
```
## Adding an extra step
The [[as .. then]] combinator lets you build a sequence of named parsers, and then get all of their results by name. 

The combinator itself is just called `as`, but all it does is start a sequence with the input parser. You need to use its `then` [[booster]] to continue the sequence – otherwise it will remain a single parser long.

```ts tile:combinators.boosting.then.ts
import {then, as} from "parjs"

int.pipe(
    as("first")
    .then("separator", ", ")
    .then("second", int)
).parse("1, 2") // {first: 1, second: 2}
```

Another example is [[map]], which applies a projection to the result of a parser. This combinator has a booster — also called [[map]] — that applies an additional projection to the result of the previous one.

```ts title:combinators.boosters.map
import {int, map} from "parjs"

int.pipe(
    map(x => x + 1).map(x => x * 2)
)
```
## Advanced functionality
The [[many]] combinator is the best example of this. By itself, it applies a [[parser|subject]] parser until that parser [[signal/fail|⛔‍fails]]. However, using its [[booster]], it lets you access variations of this pattern:

- Apply a [[parser|separator]] between every two applications of the [[parser|subject]].
- Add a [[parser|terminator]] that will close the sequence if it [[‍‍‍‍‍‍‍okay|‍‍‍‍‍‍‍✅‍okays]].
- Add a minimum or maximum number of [[‍‍‍‍‍‍‍okay|‍‍‍‍‍‍‍✅‍okays]]. 
## Convenience
Some are just provided for convenience. For example, [[many]] has the [[booster|boosters]]  [[many#map]] and [[many#filter]]. These boosters just apply the `map` and `filter` functions on the array returned by the combinator.