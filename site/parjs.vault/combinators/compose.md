#stage-4

This #🚀booster  is found on all [[combinator|combinators]]. It’s similar to the [[pipe]] tuner. Instead of applying a series of combinators to a parser, it composes multiple combinators together so they can be applied as a single combinator.

```ts title:compose.ts
import {map, each} from "parjs"
const composed = map(x => x + 1).compose(
    each(console.log)
)
```

This [[booster]] emulates the function composition operator found in many functional languages.

| Where    | How it’s written          |
| -------- | ------------------------- |
| Math     | $f\circ g = f(g(x))$      |
| Haskell  | `comb1 . comb2 . comb3`   |
| F#/OCaml | `comb1 >> comb2 >> comb3` |
