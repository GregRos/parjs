#stage-2 %% I’m unsatisfied with it. Have decided [[result]] and [[parsing state]] must be specified before coming back. %%
This #⚙️combinator saves the [[parsing state]] and applies the [[parser|subject]]. 

- If it [[‍‍‍‍‍‍‍accept|‍‍‍‍‍‍‍✅‍accepts]], the returned parser will also [[‍‍‍‍‍‍‍accept]] with the same result.
- If it [[results/fail|⛔‍fails]], [[recover]] will call its first function argument and [[‍‍‍‍‍‍‍accept]] with its result.
- If it [[panic|😬‍panics]], [[recover]] will call its second function argument and [[‍‍‍‍‍‍‍accept]] with its result.

If the [[parser|subject]] [[panic|😬panicked]], this combinator will restore the [[parsing state]] – including the [[user state]] and the [[position]] – to its saved state.

```ts title:recover.ts
import {recover, then, int} from "parjs"
int.pipe(
    then(", ", int),
    recover(x => "failed", x => "panicked")
).parse("aaaa") // "panicked"

```

# when
This lets you attach a `condition` function that will be called before recovering from the failure.

```ts title:recover.when.ts
??? need to fully spec failure and recovery
```
