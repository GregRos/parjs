---
aliases:
  - 😬‍panic
  - 😬‍Panics
  - 😬‍panics
  - 😬panicked
---
#stage-1
A [[panic]] is a special result a parser emits what it has decided something has gone wrong with the world.

Unlike a normal [[signal/fail|⛔fail]] result, [[panic|😬‍panics]] are not part of parsing a valid input. I mean, they can be. 

A #result that tells **Parjs** a syntax error has occurred, or an assertion has otherwise failed. A panic will collect the stack 