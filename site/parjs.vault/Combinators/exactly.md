#stage-4
This #⚙️combinator works like [[many]], but with an exact number of iterations. 

It will apply [[parser|subject]] a specific number of times, one after another, and return the collected results in an array.

If the [[parser|subject]] [[‍‍‍‍‍‍‍okay|‍‍‍‍‍‍‍✅‍okays]] at least once, but not the specified number of times, the returned parser will [[panic|😬‍panic]].

```ts title:exactly.ts
import {string, exactly} from "parjs"

string("x").pipe(
    exactly(2)
).parse("xx") // ["x", "x"]
```

# sepBy
This [[booster]] lets you specify a [[parser|separator]] that will be applied between every two applications of the [[parser|subject]]. 

# map
This [[booster]] works like [[many#map]], allowing you to project each of the captured results to a new value.

```ts title:exactly.map.ts
import {string, exactly} from "parjs"

string("x").pipe(
    exactly(2).map(x => x.toUpperCase())
).parse("xx") // ["X", "X"]
```
