#stage-4

This #⚙️combinator is similar to the [[then]] combinator, but returns the results as a dictionary object instead of an array. To apply it, you begin with the [[as .. then|as]] combinator, giving it a name for the result of the [[parser|subject]] parser.

By itself, it [[projection|projects]] the result into an object with a single key (the name you give it) and a single value (the result of the [[parser|subject]]).

```ts
import { int, label } from "parjs";

int.pipe(
    as("L")
).parse("1"); // {L: 1}
```

This begins a sequence you can continue with several [[booster|boosters]].
# then
This [[booster]] extends the sequence with another key and a parser key to apply. The result of the parser will be applied after all the previous parsers, and its result will be found under the given name.

Unlike the [[then#then]] booster, this booster only adds a single parser to the sequence. You need to invoke multiple times to add multiple parsers.

```ts title:as_then.then.ts
import {int, as } from "parjs"

int.pipe(
    as("lhs")
    .then("op", string(" + ", " * "))
    .then("R", int)
).parse("1 + 1"); // {L: 1, op: " + ", R: 1}
```

# skip
This [[booster]] works like the [[then#skip]] booster, adding additional parsers to the sequence and discarding their values. Unlike the previous [[as .. then#then]] booster, this one supports adding multiple parsers.

```ts title:as_then.skip.ts
import {as, int} from "parjs"

int.pipe(
    as("L")
    .skip(" + ")
    .then("R", int)
).parse("1 + 1") // {L: 1, R: 1}
```

# at
This [[booster]] works like the [[then#at]] booster. You give it the name of a result and it [[projection|projects]] the output into that result, discarding the rest.

```ts title:as_then.at.ts
import {as, int} from "parjs
int.pipe(
    as("int").then("question", "?").at("int")
).parse("1?") // 1
```

# pick
This [[booster]] works like the [[then#pick]] booster. You give it any number of keys, and it picks those keys out of the result, discarding the rest.

```ts title:as_then.pick.ts
import {as, int} from "parjs"

int.pipe(
    as("L")
     
    .then("R", int)
    .then("eq", " = ")
    .then("rhs", int)
    .pick("L", "R", "rhs")
).parse("1 + 1 = 2") // {L: 1, R: 1, rhs: 2}

```

# without
This [[booster]] works like the [[then#without]] booster. You give it any number of keys, and it removes those keys from the result.

```ts title:as_then.without.ts
int.pipe(
    as("L")
    .then("op", " + ")
    .then("R", int)
    .without("op")
).parse("1 + 1") // {L: 1, R: 1}
```

# sepBy
This [[booster]] works like the [[then#sepBy]] booster. You give a parser, and it applies that parser between every two parsers in the sequence. 

```ts title:as_then.sepBy.ts
int.pipe(
    as("first")
    .then("second", int)
    .sepBy(" + ")
).parse("1 + 1") // {first: 1, second: 1}
```

# collect
This [[booster]] is the inverse of the [[then#as]] booster, and lets you discard the names of the parsers, turning the combinator into an equivalent [[then]] combinator. This includes parsers introduced using the other [[booster|boosters]]. 

```ts title:as_then.collect.ts
int.pipe(
    as("L")
    .skip(" + ")
    .then("R", int)
    .collect()
).parse("1 + 1") // [1, 1]
```