#stage-1

The [[parjs]] function has multiple overloads and serves several purposes.

# Conversion
When called on values of the right types, the function will convert them to parsers using the same logic as an [[implicit conversion]].

```ts title:parjs.conversion.ts
import {parjs} from "parjs"

parjs("here!").parse("here!") // "here!"

parse(/abc/).parse("abc") // "abc"
```

