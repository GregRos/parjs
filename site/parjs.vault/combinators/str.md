#stage-4
This #⚙️combinator is a [[projection]] that takes no parameters. It applies the [[parser|subject]], concatenates its output if needed, and returns the whole thing as a string.

```ts title:flatten.ts
import {int, map, many, str} from "parjs"
int.parse(
    many.sepBy(", "),
    str
).parse("10, 100, -1, 5") // "10100-15"
```


