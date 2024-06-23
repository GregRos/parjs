#stage-4
This #⚙️combinator is a [[projection]] that accepts a positive integer `maxDepth`. If not specified, `maxDepth` is taken to be `Infinity`.

It applies the [[parser|subject]] parser. If it yields an array, that array will be flattened up to `maxDepth`. Otherwise, it yields the parser’s result in a singleton tuple, `[x]`. 

```ts title:flatten.ts
import {int, map} from "parjs"
int.parse(
    map(i => [[i], i]),
    flat()
).parse("1000") // [1000, 1000]
```


