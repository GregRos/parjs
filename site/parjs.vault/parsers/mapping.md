#stage-2 %%might need more work but not sure what%%
This #🧩parser parses strings that it maps into values. The prototypical use-case is parsing an enum. In this case, both strings and values are okayed.

```ts title:mapping.ts
import { mapping } from "parjs";

enum MyEnum {
    First = 1,
    Second = 2
}

mapping(MyEnum).parse("First"); // 1
mapping(MyEnum).parse("1"); // 1
```

You can supply a name for the enum as a second argument, so it can be used in [[signal/fail|⛔fail]] messages. `parjs` can’t derive the name from the enum itself.

```ts title:mapping.name.ts
import { mapping } from "parjs";

enum MyEnum {
    First = 1
}
mapping(MyEnum, "MyEnum").parse("First"); // 1
```

There is nothing special about enums during runtime, though. You can just supply an object if you like, provided it only has string or numeric keys.

```ts title:mapping.object.ts
import { mapping } from "parjs";

mapping(
    {
        Hello: true,
        goodbye: false,
        First: 1,
        object: {}
    },
    "MyMapping"
).parse("object"); // {}
```

# also
This [[tuner]] lets you expand the mapping with additional entries.

```ts title:mapping.also.ts
import { mapping } from "parjs";

mapping({
    a: 1,
    b: 2
}).also({
    c: 3,
    d: 4
});
```

This lets you enter conflicting mappings. If that happens, construction will throw an error.

```ts title:mapping.also.conflict.ts
mapping({ a: 1 }).also({ a: 2 }); // throws an error
```
