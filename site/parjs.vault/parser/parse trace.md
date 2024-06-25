#stage-2
When you use apply [[combinator|combinators]] on [[parser|parsers]] you construct a graph structure called a [[parse graph]]. 

The leaves of the [[parse graph]] are building block [[parser|parsers]], such as [[char parser|char parsers]], [[int]], [[boolean]], and so forth. Parent nodes are combinators such as [[map]] and [[many]].

When you apply a [[combinator]] to a [[parser]], a stack trace is captured. This stack trace lets 

When a parser returns a failure result, a **parse trace** is returned together with that result. The **parse trace** gives information about which parser failed based on its location in the parse tree, as well as why the reason for the failure.



Unless you run with `PARJS_TRACE=false` environment variable, applying a [[combinator]] to a [[parser]] captures a stack trace, and this stack trace is attached to the node. 

When a failure happens, part of the report will include a stack describing the position of the failed parser in the tree, together with where in your code each node was created. 

```
Expected: an integer
Found: end of input
at int
at between    
at [5/*] sepr sepr| source-location.ts:10:12
at [1/*] subj subj| source-location.ts:10:12
at [   ] subj subj| source-location.ts:10:12
at [   ] subj subj| source-location.ts:10:12
at [2/3] optn     | source-location.ts:10:12
at [   ] |0|

```

When you start parsing an input, a stack is created that describes the position in the parse tree. Each entry in this stack includes:

1. **Stage**: a string describing a named stage in the parser’s internal logic. 
2. **Index:** 
3. **Source stamp:** A location in the code where the child was added to the parent.
4. **Captured range:** This describes the text captured by a parser. It’s used in the visual trace of the failure, when required.


# Capture tracking
Each node in the tree doesn’t always get executed once – in many cases, it gets executed multiple times. This means it has multiple separate **captures** associated with it.



Applying a [[combinator]] to a [[parser]] captures a stack trace, and this trace is associated with the parent node. 

When there is a [[failure]], that failure will be traced to the specific node that failed *in the parse tree.* 

In practice, the [[parse graph]] may not look exactly like what you construct. However, there is a one-to-one mapping between your tree and the parse tree that gets executed. 

Every node in the [[parse graph]] adds some amount of overhead, but gives you the ability to trace failures down to the node in question. 

[[booster|boosters]] and [[tuner|tuners]] do not contribute to the parse tree. Instead, they modify a node before it’s inserted into one. This has both benefits and drawbacks.

1. [[tuner|tuners]] let you construct 