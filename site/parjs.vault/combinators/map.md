---
aliases:
  - ⚙️ map combinator
tags: []
---
#stage-4
This #⚙️combinator takes a single function argument, `projection`.

It’s a [[projection]] that applies the [[parser|subject]] parser and, if it [[‍‍‍‍‍‍‍okay|‍‍‍‍‍‍‍✅‍okays]], applies `projection` to it, and yields the result. 

Like other projections, if the [[parser|subject]] doesn’t [[‍‍‍‍‍‍‍okay]] this combinator won’t change its result.

```typescript
import {int, map} from "parjs"
int.pipe(
    map(x => x + 1)
).parse("100") // 101
```
# map
This [[booster]] lets you add another function that will be applied to the result of the previous function, effectively composing the two.

```ts title:map.map.ts
import {int, map} from "parjs"
int.pipe(
    map(x => x + 1).map(x => x * 2)
).parse("100") // 202
```
# flat(maxDepth = Infinity)
This [[booster]] is only available if the projection returns an `Iterable`. It will consume the `Iterable`, turning it into an array, and flatten the array up to `maxDepth`.

```ts title:map.flat.ts
import {int, map} from "parjs"
int.pipe(
    map(x => [x + 1, [x + 2, [x + 3]]).flat()
).parse(100) // [101, 102, 103]
```

