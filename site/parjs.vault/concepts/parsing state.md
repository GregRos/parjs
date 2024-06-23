#stage-1 %% Really incomplete%%
The [[parsing state]] is a mutable but copyable object that describes the current state of parsing an input. It has several components:

- The [[position]].
- The [[user state]].
- The [[parse trace]].

Parsers are discouraged from making use of globals or mutable values other than the parser state. [[combinator|combinators]] such as [[recover]] assume that by cloning and restoring the [[parsing state]] it should be possible to rewind time to before a [[parser]] was applied.
