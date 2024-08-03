---
aliases:
  - signals
---
When a parent parser invokes a child parser through its [[parser core]], the child parser finishes execution with a [[signal]]. This signal describes how and why parsing concluded, as well as the emitted value or failure reason.

Signals are only used between parsers, as part of their [[parser core]]. Invoking a parser’s external interface produces a [[result]].

| Signal                 | Check       |
| ---------------------- | ----------- |
| [[okay\|✅okay]]        | `s.isOkay`  |
| [[signal/fail\|⛔fail]] | `s.isFail`  |
| [[panic\|😬‍panic]]    | `s.isPanic` |
| [[die\|💀‍‍die]]       | `s.isDie`   |

