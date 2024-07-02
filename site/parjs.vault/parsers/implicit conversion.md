#stage-1
In order to make writing parsers more natural, in all cases when a [[combinator]] or other function requires a [[parser]] input, a **string** or **regular expression** value can be used instead. The value will be wrapped witha aparser

This only works for **strings** and **regular expressions**. Strings are converted using [[string]] while regular expressions use [[regexp]]. Note that this only works when 

```ts title:implicit-conversion.ts
import {then} from "parjs"

const 
```
