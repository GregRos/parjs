#stage-4
This #⚙️combinator applies the [[parser|subject]] parser multiple times, one after another. 

It supports [[booster|boosters]] that change the stopping criterion or the way in which the [[parser|subject]] is applied, such as by adding a separator and a max number of applications.

fThe default version will apply the [[parser|subject]] until it [[signal/fail|⛔fails]], yielding an array of the accumulated results. If the [[parser|subject]] [[signal/fail|⛔‍fails]] immediately, the array will be empty.

```ts title:many.ts
import { many, string } from "parjs";

string("x").pipe(
    many
).parse("xxxx") // ["x", "x", "x", "x"]
```
# sepBy
Applies a [[parser|separator]] between every two applications of the [[parser|subject]]. The results of the separator won’t be part of the yielded array.

```ts title:many.sepBy.ts
import { many, int } from "parjs";

int.pipe(
    many.sepBy(", ")
).parse("1, 100, 52") // [1, 100, 52]
```
# till
okays a [[parser|terminator]] and attempts to apply it after every application of the [[parser|subject]]. If the terminator [[‍‍‍‍‍‍‍okay|‍‍‍‍‍‍‍✅‍okays]], then the combinator will stop and yield the accumulated results.

If the terminator [[signal/fail|⛔‍fails]], then parsing will continue. In any case, the result of the terminator won’t be part of the array.

```ts title:many.till.ts
import {string, many} from "parjs"

string("x").pipe(
    many.till("y")
).parse("xxxy") // ["x", "x", "x"]
```

> [!tip] PROTIP
> This [[booster]] **adds** another condition for iteration to stop. The combinator will still stop if the [[parser|subject]] [[⛔‍Fail|⛔‍fails]].
# min
sets a minimum number of times the [[parser|subject]] must [[‍‍‍‍‍‍‍okay]]. 

If the parser [[okay|‍‍‍‍‍‍‍✅‍okays]] once, but less than `count` times, the returned parser will [[panic|😬‍panic]].

In TypeScript, this [[booster]] also changes the type of the yielded value to a tuple with at least `count` elements.

```ts title:many.min.ts
import {string, many} from "parjs"
string("x").pipe(
    many.min(3)
).parse("xxxx") // ["x", "x", "x", "x"]

string("x").pipe(
    many.min(2)
).pipe("x") // PANIC!
```
> [!tip] TypeScript
> Using this [[booster]] also changes the type of the yielded value to a tuple with up to `max` elements.
# max
ximum number of times the [[parser|subject]] will be applied. In TypeScript it also changes the type of the yielded value to a tuple with up to `count` elements.

```ts title:many.max.ts
import {many, string, then} from "parjs"

string("x").pipe(
    many.max(3),
    then("x")
).parse("xxxx") // [["x", "x", "x"], "x"]
```
# map
This [[booster]] lets you apply a projection on each value yielded by the [[parser|subject]]. 

```ts title:many.map.ts
import {many, string, then} from "parjs"

string("x").pipe(
    many.sepBy(", ").map(x => x.toUpperCase())
).parse("x, x, x") // ["X", "X", "X"]
```

# filter
This [[booster]] lets you apply a predicate on each value yielded by the [[parser|subject]]. If the predicate returns `false`, the value won’t be yielded. 

```ts title:many.filter.ts
import {many, string, then} from "parjs"

string("x", "y", "Z").pipe(
    many.filter(x => x === "x")
).parse("x, y, z") // ["x"]
```

# reduce
This [[booster]] applies an accumulator function on the yielded values. You must provide an initial value.

```ts title:many.reduce.ts
import {many, string, then} from "parjs"

string("x").pipe(
    many.sepBy(", ").reduce("", (acc, cur) => acc + cur)
).parse("x, x, x") // "xxx"
```

