# Jase - JS Parser Combinators
Jase is a JavaScript library of parser combinators, similar in principle and in design to the likes of [Parsec](https://wiki.haskell.org/Parsec) and its F# adaptation [FParsec](http://www.quanttec.com/fparsec/).

It's also similar to the [parsimmon](https://github.com/jneen/parsimmon) library, but intends to be superior to it.

## What's a parser combinator?
A parser, in our context, is a function that takes a string and outputs something else:

	Parser<TOut> : (input : string) => TOut

Two examples of parsers would be `a` and `b`, where `a` just parses the character `'a'` and `b` parser the character `'b'`. Each returns the value it parsed.

	a : (input : string) => string;
	b : (input : string) => string;

Now let's introduce a *combinator* **C**. **C** takes two parsers 

$$df$$
