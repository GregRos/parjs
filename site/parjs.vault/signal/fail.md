---
aliases:
  - ⛔fail
  - ⛔‍fails
  - ⛔‍failed
---
#stage-2
A [[signal/fail|⛔fail]] is emitted when a parser quickly decides that it can’t parse the input it has received. This will usually not result in an error, because a [[signal/fail|⛔fail]] is often a normal part of parsing a valid input.

For example, the [[many]] combinator applies a [[parser|subject]] parser until that parser [[signal/fail|⛔‍fails]]. So not only does [[many]] recover from this failure, it’s even expected to happen.

Similarly, a [[signal/fail|⛔fail]] result allows the [[or]] combinator to apply alternative parsers until one [[‍‍‍‍‍‍‍okay|‍‍‍‍‍‍‍✅‍okays]]. Without the [[signal/fail|⛔fail]], it wouldn’t be able to do this.
# Upgrading
While a [[signal/fail|⛔fail]] is a normal part of parsing, it can also get out of hand if it’s not handled immediately. 

Specific [[combinator|combinators]], mostly those that apply parsers in sequence, have the #upgrades-failures tag. This means that in some cases, they will turn a normal [[signal/fail|⛔fail]] result into a [[panic]] result. 

While [[panic|😬‍panics]] are still recoverable, they usually mean something has gone wrong. 
# Structure
Although a [[signal/fail|⛔fail]] is a normal part of parsing, it still needs to carry information about:
1. What went wrong
2. Where it happened

And so on. This is where the **structure** of the [[signal/fail|⛔fail]] comes in. 


\