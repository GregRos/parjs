The new parse API will look like this.
# parse(input)
This method will parse the `input` and return the final result value, not a [[result]] object. If parsing fails, an exception is thrown.
# safeParse(input)
This method will parse the `input` and return the final [[result]] object. This object is very similar to what the `parse` method returns in v1. 

However, the `kind` property will contain a different set of strings.


In practice, it will look like this:
```ts
{
    kind: "ok" | "fail" | "panic" | "die",
    value: ?, // if `kind == "okay"`
    ...
}
```
# oldParse(input)
**Deprecated.** Also, not visible by default. Needs to be imported using the following in order to be visible:

```ts
import "parjs/compatibility"
```

It will return a result value in the style of v1, in particular `kind` will contain the v1 strings.


# [[pipe]]
I’m going to try to describe the type of this method rigorously, but without actually implementing it in TypeScript since that takes longer.

The general type is very similar the type of the method now in v1, or the type of `pipe` in rxjs. The idea is that each argument can either be a function or a combinator object implementing the correct interface.

Right now, combinators are funcitons

This means this rigorous description isn’t necessary in this specific case. You can think of it as an experiment. I have no idea if it’s comprehensible to anyone besides myself.

So, for all arrays of types:
$$\mathrm{Types=[Type_1, \dots, Type_n]}$$
(that is, this is method is generic with `Types extends any[]`)
Let $\mathrm{Types'}$ be $\mathrm{[string, …Types]}$. Then, the type of $Arg_

1. If $k = 1$, then $

1. A function $Arg_k 
2. An object $Arg_k : \mathrm{Combinator_{Type_k, Type_{k+1}}}$ 

3. A function


