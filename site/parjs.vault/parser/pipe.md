#stage-4
This is a #🛠️tuner  defined on all [[parser]] objects. It’s the primary way you’ll apply combinators to a [[parser|subject]] parser. 

You call this method with zero or more combinators. It will start be applying the first combinator to the [[parser|subject]] parser, and continue by applying each subsequent combinator to the parser returned in the previous one.

This lets you apply lots of combinators in a row.

```ts title:pipe.ts
import {int, map} from "parjs"
int.pipe(
    map(x => x + 1),
    map(x => x * 2)
).parse("100") // 202
```

This [[tuner]] simulates the `|>` or pipe operator found in functional languages such as Haskell, OCaml, and F#. 

| Where    | How it’s written          |
| -------- | ------------------------- |
| Haskell  | `comb1 . comb2 . comb3`   |
| F#/OCaml | `comb1 >> comb2 >> comb3` |
# Functions
Built-in combinators 