---
aliases:
  - parser cores
---
#stage-3
The parser core is a lean implementation of parser logic, as well as the implementation of [[tuner|tuners]]. 

```ts title:internal.class.ts

abstract class ParjserCore<Result> {
    __EXTERNAL__!: External 
    /**
    An example constructor
    */
    constructor(private readonly _inputParser: ParjserCore) {
    }
    protected abstract _impl(ps: ParjsState): tmp_ParjsSignal<Result>
    impl(ps: ParjsState) {
        // Keep track of the executing parser by
        // modifying `ps`. 
        // Then invoke `_impl` and return its result.
    }
    // Tuners are defined here as methods returning ParjsCore.
}
```

The central method of the core parser is called `_impl`, and this method contains the parser’s implementation. However, rather than being called directly, it will be called by the public method `impl` which will maintain the [[parse trace]], the [[capture trace]], and so on. 

`_impl` is expected to return a [[signal]] object of the type `tmp_ParjsSignal`. As an optimization, the parser may choose to return the same object with every call to `_impl`, mutating it to reflect the state of the call, so parent parsers shouldn’t store this signal object. The unusual `tmp_` prefix is meant to reflect this.

[[tuner|tuners]] are defined as instance methods on the parser core, accepting parameters and returning a new parser core object. They should not create a parent parser core, but rather a sibling parser with a different configuration.

The `tmp_` prefix is meant to convey that the method may choose not to return a new object, but can instead return the same object after mutating it to reflect the state of the call.

This means that this object shouldn’t be stored between one invocation and the next without cloning it.

 