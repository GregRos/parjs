#stage-3
This lists breaking changes between v1 and v2. There are a lot but it has been a consideration.

Also, the [[compatibility]] import is meant to bridge the two.

# [[float]]
Has a much more restrictive default configuration and you can’t change the base of the number. 
# `manySepBy`
All `manyX` combinators are integrated into  [[many]] as [[booster|boosters]], for example [[many#sepBy]].

# Character parsing
All character-based parsers work very differently and are inherently incompatible. Same with parsers that parse strings of specific lengths. See [[char parser|char parsers]] for more information about this.

The [[read]] parser is a hold over from the previous system, but it’s deprecated on release. It doesn’t have the name of a previous parser on purpose. 
# `thenq`/`qthen`
These are gone. 
- `thenq` is replaced by [[skip]] or the [[booster]] [[then#skip]].
- `qthen` can be replaced using [[then]] and boosters like [[then#at]], [[then#pick]] and so on.
# combinators – no longer functions
This is detailed in [[combinator|combinators]].

The built-in combinators offered by the library will no longer be functions, as the function API interferes with the special combinator API I want to put on them.

This is a breaking change, since a user might have some code that invokes a combinator on a parser as a function. However, such code will no longer work.

**Function combinators will still be accepted** by e.g. the [[pipe]] method. They won’t be the default, but they won’t be deprecated either.
# Result type
The result type has changed. It’s actually been split into two different things:
1. The [[signal]], which is a result sent and received by [[parser core|parser cores]]. There are 4 types of signals, just like the current system.
    1. However, the names are different. See the table below.
    2. The `kind` of the signal is a numeric enum rather than a string.
    3. Emojis are different.
2. The [[result]], which is what’s returned by [[safeParse]]. 
    1. There are only two types of results — an *okay result* or  *failure result*. The two are differentiated by the `isOkay` property. 
    2. The result *does* contain the final signal. But there are still only two *result types*. The signal is just extra information.

I haven’t fully fleshed this part out yet.

| v1: result kind | v1: emoji | v2: signal     | v2: emoji |
| --------------- | --------- | -------------- | --------- |
| `"OK"`          | —         | `Signal.OK`    | ✅         |
| `"Soft"`        | 😕        | `Signal.Fail`  | ⛔         |
| `"Hard"`        | 😬        | `Signal.Panic` | 😬        |
| `"Fatal"`       | 💀        | `Signal.Die`   | 💀        |
# Visualization
I’m deeply dissatisfied with the current approach to visualizing failures. I’m working on something better, but I haven’t fleshed it out yet.