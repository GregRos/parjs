---
aliases:
  - "#🧩parser"
  - subject
  - separator
  - terminator
  - parsers
cssclasses:
  - p
---
#stage-2 %%Needs more work, probably need to write most of the interface before coming back%%
A #🧩parser is an object that can be used to process text and produce a value from it. In Parjs, [[parser|parsers]] have two interfaces they need to implement:

1. The **external interface**, which includes the `parse`, `pipe`, and similar methods.
2. The **internal interface**, which includes the `apply` method.

The external interface is largely provided by `parjs` using the `createParjser` method. It 

```ts title:parjser.ts
createParjser 
```
when invoked, advances the [[parsing state]] and produces a [[result]], which may be:

- An [[‍‍‍‍‍‍‍accept]] result, together with a yielded value.
- A [[results/fail|⛔fail]] result..
- A [[panic]] result.
- A [[die|💀‍‍die]] result.

These different result types are different signals the parser can send, and have significant effects on the parsing process. 
# `parse`
The `parse` method 


Conceptually, #🧩parser is a function that accepts a `string` input and yields an output. 

```typescript
(input: string) => Output;
```

In practice, though, it’s an object with several methods.

```typescript
interface Parser<Output = unknown> {
    parse(input: string, userState?: UserState): Output
    safeParse(input: string, userState?: UserState):
}
```

# Two kinds of parsers

To start with, there are two kinds of parsers that are quite different:

1. Building block parsers.
2. Combinated parsers.

## Building block parsers

These parsers are applied directly to text, processing it and producing a result. Build block parsers are special in that they don’t accept any [[parser]] inputs. They are leaf nodes in the [[parse graph]] representation.

## Combinated parsers

These parsers are the result of applying a [[combinator]] on an **🧩‍Subject** parser. They are branch nodes in the [[parse graph]], and usually apply input parsers in a certain abstract pattern. They rarely deal with text directly.

# Parser structure

Composing [[parser| parsers]] together with [[combinator| combinators]] results in a [[parse graph]], which is a tree-like graph of parsers. The parse tree is similar to the AST of a program. Constructing a good parse tree is important for [[failure handling]] and [[debugging]].

# Captures

Combinators
