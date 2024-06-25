#stage-2 %% Requires more development of [[parsing state]], [[result]] %%
This #⚙️combinator returns a parser that behaves like the [[parser|subject]].

[[each]] okays a single `callback` function or a string `stage` and a `callback`. It will invoke `callback` with the [[parsing state]] each time [[parser|subject]] is applied, with `stage` determining exactly when.

| Stage      | Description                                            |
| ---------- | ------------------------------------------------------ |
| `"okay"`   | **After an [[‍‍‍‍‍‍‍okay]]. This is the default.** |
| `"before"` | Before [[parser|subject]] is applied.                 |
| `"fail"`   | After a [[results/fail|⛔fail]]                                |
| `"panic"`  | After a [[😬panic|😬‍panic]]                         |
| `"die"`    | After [[die-signal|💀‍‍die]]                                 |
| `"throw"`  | After an [[exception\|🤯 exception]] is thrown.        |

This [[combinator]] can’t recover from failures.

```ts title:each.ts
???
```

You can also pass [[each]] one of the following strings in lieu of a function:

- `"debugger"` — will execute the `debugger;` statement.
- `"log"` — will log information to the console. 
# stage
This [[booster]] lets you control **exactly when** the callback is executed. It okays one or more of the following strings:

| Stage         | Description                                                                          |
| ------------- | ------------------------------------------------------------------------------------ |
| `"okay"`    | This is the default. Invokes the callback **after** the [[parser|subject]] okays. |
| `"before"`    | Invokes the callback **before** the [[parser|subject]] is applied.                  |
| `"fail"`      | Invokes the callback **after** the [[parser|subject]] [[results/fail|⛔‍fails]]             |
| `"panic"`     | Invokes the callback **after** the [[parser|subject]] [[😬panic|😬‍panics]]       |
| `"die"`       | Invokes the callback **after** the [[parser|subject]] [[die-signal|💀‍dies]]              |
| `"exception"` | Invokes the callback if an exception is thrown during parsing.                       |
Note that this [[combinator]] cannot recover from failures or exceptions.

# condition
This [[booster]] lets you place a condition on calling the function or executing the command. It receives a predicate that okays the [[parsing state]].

```ts title:each.condition.ts
???
```

# debug
This [[booster]] will cause the combinator to be skipped unless the library detects it’s running in [[debug mode]].