#stage-4
This #⚙️combinator is the main thing you use when you want to apply one parser after another. It applies the [[parser|subject]] parser, **and then** one or more parsers in sequence, returning the collected results in a tuple.

This combinator #upgrades-failures. If the [[parser|subject]] parser [[‍‍‍‍‍‍‍okay|‍‍‍‍‍‍‍✅‍okays]] but a subsequent parser [[signal/fail|⛔‍fails]], the [[signal/fail|⛔fail]] will be upgraded into a [[panic|😬‍panic]].

While in some other libraries this only happens if a parser [[consumed input]], in this one it doesn’t matter. This is because **parser structure** rather than **input consumption** is what determines whether failures are upgraded.

The following example uses [[implicit conversion]].

```typescript title:"then.ts"
import { int, then } from "parjs";

int.pipe(
    then(" + ", int)
).parse("1 + 2"); // [1, " + ", 2]
```

## Composing [[then]]
When you compose this combinator, it will result in a nested tuple.

```ts title:then.compose.ts
import {int, then} from "parjs"

int.pipe(
    then(" + "), 
    then(int)
).parse("1 + 1"); // [[1, " + "], 1]
```

These can be annoying to deal with. Luckily there are is a [[booster]] to help with that.
# then
This [[booster]] extends the sequence with additional of parsers. They are included in the result, added to the end of the tuple as though they'd been given to the combinator.

```ts title:then.then.ts
import { then, int } from "parjs";

int.pipe(
    then(" + ")
    .then(int)
).parse("1 + 1"); // [1, " + ", 1]
```
# skip
This [[booster]] lets you specify one or more parsers that are applied in sequence, but the results of which are discarded. It behaves in the same way as the [[skip]] combinator.

```ts title:then.skip.ts
import { int, then, string } from "parjs";

int.pipe(
    then(string(" + ", " * "), int)
    .skip(" = ")
    .then(int)
).parse("1 * 2 = 2"); // [1, " * ", 2, 2]
```
# at
This [[booster]] is a [[projection]] that lets you pick a specific results from the tuple, ignoring all other results. You pick the result by index, and you can use either positive indexing (from the start) or negative indexing (from the end).

An index of `0` or `-length` corresponds to the result of the [[parser|subject]].

```ts title:"then.at.ts"
import { int, string } from "parjs";
int.pipe(
    // discards everything except the subject:
    then(" + ", int).at(0),
).parse("1 + 1"); // 1
```

Trying to select a parser with a non-existent index will result in a **compilation error**, as well as a **runtime error**. 

This [[booster]]  changes the type of the yielded value. After using it, you can no longer use other [[booster|boosters]] belonging to the [[then]] combinator.

```ts title:then.at.continue.ts
import {int, string} from "parjs"
int.pipe(
    then(" + ").at(0)
    .then(int)
).parse("1 + 1") // [1, 1]
```
# pick
This [[booster]] is a [[projection]] that lets you select one or more results by index, and discard the rest. As with [[#at]], using an invalid index will result in a compilation and a runtime error.

```ts title:then.only.ts
import { int, string } from "parjs";
int.pipe(
    // parse + and another int
    // then = and another int
    // keep only the ints at positions 0, 2, 4
    then(" + ", int, " = ", int).pick(0, 2, -1)
).parse("1 + 1 = 2"); // [1, 1, 2]
```

Note that this [[booster]] won’t change the order of the results, even if you give the indexes out of order.
# without
This [[booster]] is another [[projection]] that’s the inverse of [[#only]], letting you discard items at specific indexes.

```ts title:then.discard.ts
import { int, string } from "parjs";
int.pipe(
    // discard the operator strings
    then(" + ", int, " = ", int).without(1, 3)
).parse("1 + 1 = 2"); // [1, 1, 2]
```
# sepBy
This [[booster]] lets you apply a **separator** between every pair of parsers, and optionally once at the end. The separator is applied between the [[parser|subject]] and the first input parser, as well as between every two subsequent input parsers.

The results of the separator won’t be included in the array.

If the separator [[signal/fail|⛔‍fails]] after succeeding at least once, the failure will be [[Upgrading failure|upgraded]] to a [[panic|😬‍panic]].

```ts
import { int, f } from "parjs";

int.pipe(
    then(int, int).sepBy(",")
).parse("1,2,3"); // [1, 2, 3]
```
# as
This [[booster]] lets you transition to the [[as .. then]] combinator, which acts like [[then]] but returns its results as a dictionary object rather than an array.

You must give it a name for each parser in the sequence that will be in the result, since the [[as .. then]] combinator expects each one to have a name. After that, you can continue the sequence using the [[as .. then]] combinator's [[booster|boosters]].

```ts
import { int, then, skip, string, as } from "parjs";
// Parse the equation sequence:
int.pipe(
    then(string(" + ", " * "), int)
    .skip(" = ")
    // We use `as` to name every result, ignoring the
    // = sign as it was skipped:
    .as("L", "op", "R")
    // We use the `then` *booster* to parse another int:
    .then("rhs", int)
).parse("1 + 1 = 2"); // {L: 1, op: " + ", R: 1, rhs: 2}
```
