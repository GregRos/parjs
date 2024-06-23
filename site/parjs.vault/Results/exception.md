---
aliases:
  - 🤯 exception
---
#stage-1
A parser [[results/fail|⛔fails]], [[panic|😬‍panics]], or even [[die|💀‍‍dies]] if there is a problem with the **input**. In contrast, a parser throws an exception only if it hasn’t been configured correctly, or simply has a bug. 

That’s why there is no [[combinator]] that recovers from exceptions thrown by parsers — it’s just not a normal part of parsing an input.
# Why?
There are many, many reasons for this, and they’re very serious.
## Performance
Parsing is supposed to be fast. Throwing an exception is a major performance hit that just can’t be optimized for.

While for some use-case most inputs are valid, for many others the parser will see hundreds or thousands of invalid inputs for every valid input. In other words, in many cases **optimizing for invalid inputs** is more important than **optimizing for valid one
## 