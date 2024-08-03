#stage-3 %%needs some more examples%%
This #🧩parser okays a function that produces an input [[parser]]. This function will be called the first time [[later]] is invoked, and the result will be cached for subsequent calls.

It lets you produce a lazily evaluated parser, enabling recursive parsers.

```ts title:later.ts
import {later, int} from "parjs"

int.pipe(
    later()
)
```