# Debugging and the Parser Stack

When you apply a combinator to a parser, you get a new parser object which references the old parser and executes it at some point. Here is an example:

```typescript
let pMapped = stringLen(2).pipe(
    must(x => x == "ab"),
	map(x => `the char was: ${x}`);
);
```

You can describe the resulting structure like this:

```
Map(Must(StringLen))
```

Each of these represents a separate parser object.  If one of these parsers emits a failure, you will get a trace of where the failure originated, the reason for the failure, its severity, and other information.

The origin of the failure will be in the form of a stack. For example, calling `pMapped.parse("a")` might produce something like this:

```
stringLen < must < map

0| a
   ^ expected 2 or more characters
```

There are two ways to get more information out of a parser trace:

1. Using combinator groups.
2. Using labeled parsers.

Both of these features enrich the trace with more information. 

### Labeled parsers

You can attach an informational label to a parser that can later be recovered as part of diagnostics and debugging. This label can say that the parser is supposed to parse. It can be used to group a complicated parser under one umbrella. 

For example, let's say you want to create a parser for parsing the digits `1` or `0`. 

```typescript
let pBit = charWhere(x => x === "0" || x === "1");
```

If you this parser fails, it will appear in the trace simply as `charWhere`:

```
charWhere <<|
```

But this strips important information from the parser - you might have a dozen of these `charWhere` parsers around, so you'd want to know which one actually failed.

(While in this case the problem can also be solved by customizing the failure information, in other cases the problem is more complicated.)

Labeling a parser is done using the labeling combinator - `label`. It's a combinator like most others, and it creates an entirely new parser instance. 

```typescript
let pBit = charWhere(x => x === "0" || x === "1").pipe(
	label("bit")
);
```

This adds a new node to the trace with the label:

```
charWhere | "bit" <||
```

### Combinator groups

Let's say you want to define a new combinator. Let's call it `manyAtLeast5`, and it works just like `many()` - except that it checks that `many()` succeeded at least 5 times.

```typescript
let manyAtLeast5 = source => {
    return source.pipe(
    	many(),
        must(arr => arr.length >= 5)
    );
}
```

Now, let's try to apply it on a parser such as `string`:

```typescript
let pAtLeastFiveXs = string("x").pipe(
	manyAtLeast5,
    map(x => x.length)
).parse("xxxx");
```

The parser trace from this failure will look like this:

```
must < map <<|
```

While this trace is definitely correct, it's hard to understand what it means just from looking at the parser `pAtLeastFiveXs`, since when we wrote it, we didn't directly use the `must` combinator in its definition. We might not know that `must` is being used here to implement the functionality of `manyAtLeast5`, and this information can also change.

Using combinator groups lets us inject all this information into the parser tree.

To define a combinator group, you use the meta-combinator `group(...)`, which also serves to compose multiple combinators into one:

````typescript
let manyAtLeast5 = group(
	"manyAtLeast5",
    many(),
    must(arr => arr.length >= 5)
);
````

This embeds some more information into the parser tree, which is later recovered and lets the following stack trace be constructed:

```
'manyAtLeast5'(... < must) < map <<|
```

This both gives you some information about which parser actually failed, and tell you that it was part of the functionality of the `manyAtLeast5` combinator.

The library uses this to implement other combinators that end up creating more than one parser, such as `qthen`.

