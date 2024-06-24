⛔ **Don’t use this. Use a [[char parser]] instead.**

This #🧩parser reads a string with a fixed number of JavaScript characters – that is, strings with a `length` of $1$.

```ts title:read.ts
import {read} from "parjs"
read(3).parse("abc") // "abc"
```
# every
**⛔ Don’t use this. Use [[base char class|char classes]] instead.**

This [[booster]] lets you apply a predicate on codepoint read from the input. **You receive the codepoint as an integer.**

```ts title:read.where.ts
import {read} from "parjs"
read(3).every(x => x < 127).parse("abc") // "abc"
```
# must
**⛔ Don’t use this.**

This [[booster]] lets you apply a predicate on the entire string. If the predicate returns `false`, the returned parser [[results/fail|⛔‍fails]]. 

```ts title:read.must.ts
import {read} from "parjs"
read(3).must(x => {
    return x.startsWith("a")
}).parse("abc") // "abc"
```