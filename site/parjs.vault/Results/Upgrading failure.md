---
aliases:
  - upgrade failures
  - upgrades failures
  - upgraded
---
#stage-1
Some combinators #upgrade-failures. This means that in some cases, if one of their input parsers [[results/fail|⛔fails]], the combinator will turn it into a [[panic|😬‍panic]]. This usually happens when the combinator applies multiple parsers.

When multiple different parsers are applied in sequence, if the first parser [[‍‍‍‍‍‍‍accept|‍‍‍‍‍‍‍✅‍accepts]] but a subsequent one [[results/fail|⛔‍fails]], the combinator will turn it into a [[panic]]