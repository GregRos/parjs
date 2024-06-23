#stage-3 %%I think it gets the important points across but needs more work%%
The [[parse graph]] is a tree-like structure that you construct when you modify [[parser|parsers]] with [[combinator|combinators]]. It’s the parser equivalent of a [call graph](https://en.wikipedia.org/wiki/Call_graph). 

- The **leaf nodes** of this structure are basic parsers, like [[int]], [[ascii]], and [[float]].
- The **parent nodes** are combinators such as [[map]], [[many]], and [[then]]. 

Parent nodes always have **labeled edges**. The label describes the purpose of a child parser. Labels are determined when the parser is constructed. Here are examples of labels:

- **repeated**
- **separator**
- **alternative:01**
- **item:02**

![Parse graph of `int |> then(", ", int) |> many.sepBy(" | ")`](parse-graph.svg "int |> then(", ", int) |> many.sepBy(" | ")")

- The parse graph is the best equivalent Parjs has to source code and is an important tool when [[debugging]] your parser. 
- It can also be used to inspect the structure of a parser to give a visual representation of the grammar it’s supposed to parse.
- It determines how [[failures]] propagate through the parser.

When a [[combinator]] is applied to a [[parser]], creating a **parent node** in the graph, a stack trace is captured that links the node with your source code.
# Assertions
When **control flow** leaves a node `parjs` performs various assertions on the [[parsing state]] to make sure there are no bugs. These can be disabled using [[global options]].

# [[booster|boosters]] and [[tuner|tuners]]
These instance methods modify [[combinator|combinators]] or [[parser|parsers]] before one is applied on the other, so they’re not present in the [[parse graph]]. 

These instance methods modify [[combinator|combinators]] **before** they are applied to [[parser|parsers]], so they’re not present in the [[parse graph]]. 

# [[tuner|tuners]]
These instance methods modify [[parser|parsers]] **before** they are acted on by [[combinator|combinators]], so they’re not present in the [[parse graph]] either.
