#stage-2
This #⚙️combinator is the main thing you’re going to use if you want to parse one of several alternative inputs.

It applies the [[parser|subject]] parser and, if it [[results/fail|⛔‍fails]], each of the input parsers until one [[‍‍‍‍‍‍‍accept|‍‍‍‍‍‍‍✅‍accepts]]. It then returns the result of the parser that [[‍‍‍‍‍‍‍accept|✅accepted]]. 

```ts title:alts.ts
import {int} from "parjs"

int.pipe(
    or("a string")
).parse("a string") // "a string"
```

# or
This [[booster]] lets you add additional alternative parsers to the list of alternatives.

```ts title:alts.or.ts
int.pipe(
    or("a string").or("some other string")
).parse("some other string") // "some other string"
```

