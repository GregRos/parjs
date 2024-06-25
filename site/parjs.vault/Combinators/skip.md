#stage-4
This #⚙️combinator works like [[then]]. It applies the [[parser|subject]] and **and then** one or more parsers in sequence. It only yields the result of the [[parser|subject]], ignoring all the other results. 

This combinator #upgrade-failures. If the first parser in the sequence [[‍‍‍‍‍‍‍okay|‍‍‍‍‍‍‍✅‍okays]], but a subsequent parser [[signal/fail|⛔‍fails]], the resulting parser will [[panic]].

```ts title:skip.ts
import {skip, int} from "parjs"
int.pipe(
    skip("...", "?")
).parse("1...?"); // 1
```
# skip
This [[booster]] lets you add additional parsers that will be applied after the rest. Their values will be discarded.

```ts title:skip.skip.ts
import {int, skip} from "parjs"
int.pipe(
    skip("...").skip("?")
).parse("1...?")
```

# sepBy
This [[booster]] applies a [[parser|separator]] between every two parser applications. It works like [[then#sepBy]].

```ts title:skip.sepBy.ts
import {int, skip} from "parjs"

int.pipe(
    skip(int, int).sepBy(" + ")
).parse("1 + 1 + 1) // 1
```