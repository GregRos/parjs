#stage-4
This #🧩parser will consume all the rest of the input and yield the text that was parsed. It always succeeds.

```ts title:rest.ts
import {rest} from "parjs"
rest.parse("abcd") // "abcd"
```

