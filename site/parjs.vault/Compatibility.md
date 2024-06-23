#stage-2
I haven’t given a lot of though to compatibility at this stage. There has been some, but right now the documentation introduces breaking changes, as well as confusing changes. These might be rethought.

Some parsers

## [[float]]
Has a much more restrictive default configuration and you can’t change the base of the number. 
## `manySepBy`
All `manyX` combinators are integrated into  [[many]] as [[booster|boosters]], for example [[many#sepBy]].

## Character parsing
All character-based parsers work very differently and are inherently incompatible. Same with parsers that parse strings of specific lengths.
- New model allows parsing all of Unicode and more.
- Allows for lots of optimizations.
- It’s more configurable, and the configuration costs less in terms of performance.
## `thenq`/`qthen`
These are gone. 
- `thenq` is replaced by [[skip]] or the [[booster]] [[then#skip]].
- `qthen` can be replaced using [[then]] and boosters like [[then#at]], [[then#pick]] and so on.


