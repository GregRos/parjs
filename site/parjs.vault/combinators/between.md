#stage-4

This #⚙️combinator applies the [[parser|subject]] parser between two others, yielding the result of the [[parser|subject]]. 

If you supply a single parser, it will apply that parser before and after the [[parser|subject]]. Note that the following example uses an [[implicit conversion]].

```ts title:between.one.ts
import {between, int} from "parjs"

int.pipe(
    between("|")
).parse("|1|") // 1

```

If you supply two parsers, it will apply the first before and the 2nd after the [[parser|subject]].

```ts title:between.two.ts

import {between, int} from "parjs"

int.pipe(
    between("(", ")")
).parse("(1)") // 1
```