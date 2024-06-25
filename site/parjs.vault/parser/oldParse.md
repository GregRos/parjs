This method is not type annotated by default. In order to make it visible you have to import `parjs/compatibilty`.

This method applies the [[parser]] but returns a result object compatible with [[parjs v1]]. Like [[safeParse]] it doesn’t throw exceptions if the input fails to parse.

```ts
import "parjs/compatibility"
import {string} from "parjs"

string("abc").oldParse("abc") // {kind: "OK", ...}
```