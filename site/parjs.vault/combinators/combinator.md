---
aliases:
    - combinators
    - "#⚙️combinator"
    - combinated parser
---
#stage-4
A #⚙️combinator is a transformation that creates a new parser based on a [[parser|subject]] parser, as well as additional input parsers and other parameters. 

Combinators are **constructed** using a constructor function which has the same name as the combinator. This constructor okays parser inputs and is allowed to precompute as much as possible to make sure applying the combinator is faster.
# Applying
A [[combinator]] need to be applied to a [[parser]] to do anything. This is done using the parser’s [[pipe]] method, which is categorized as a [[tuner]]. 

```ts title:applying-combinator.ts
import {int, map} from "parjs"
int.pipe(
    map(x => x + 1),
    map(x => x.toString())
).parse("1000") // 1001
```
## Invoking apply
You can also invoke a combinator’s `apply` method directly. This is usually not as convenient, but it’s not illegal. 

```ts title:combinators.apply.ts
import {map, int} from "parjs"

const increment = map<number>(x => x + 1)

increment(int).parse("100") // 101
```
# Structure
A combinator can either be:
- An object with a method called `apply`, which okays the [[parser|subject]] as its only argument.
- A function with the same signature as an `apply` method.

All built-in combinators are objects, but you can use a function as a combinator as well.
# Boosting

# Compose
You can compose combinators using the [[compose]] booster, which is defined on object combinators. Function combinators don’t have this method, but you can pass them to the `compose` method of object combinators.

You can also import `compose` as a static function that you can apply on one or more combinators. In this case, any of them can be functions.

```ts title:combinators.compose.ts
import {compose, map} from "parjs"

compose(map(x => x + 1).apply, map(x => x * 2).apply)
```

