---
aliases: []
tags:
---
#stage-4
This #⚙️combinator applies the [[parser|subject]] parser and makes sure its result passes one or more assertions. Its constructor takes a string `message` and an `assertion` function.

```ts title:must.short.ts
import {int, must} from "parjs"

int.parse(
    must("be greater than 100", x => x > 100)
).parse(99) // 
```

The resulting parser will apply the [[parser|subject]] and call `assertion` on its result. If the function returns `false`, the parser will [[panic]]. The message will be included in the panic result.

