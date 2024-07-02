#stage-4
This #🧩parser parses strings and maps them to boolean values, `true` and `false`. By default, it will parse the strings `"true"` and `"false"`.

```ts title:boolean.ts
boolean().parse("true");
```

You can instead give it **two string arguments**, one string for `true` and another for `false`. These strings will be used **instead**.

```ts title:boolean.tf.ts
boolean("T", "F").parse("T"); // true
```

You can also give it **one or more pairs of strings**. In that case, the first item of each pair is mapping to `true `and the next one to `false`, and any of the strings will be okayed.

```ts title:boolean.arrays.ts
boolean(["T", "F"], ["true", "false"]);
```

The parser will try to parse strings in the order in which they were given. However, if you supply conflicting mappings, it will error instead.

```ts title:boolean.conflict.ts
boolean(["maybe", "no"], ["yes", "maybe"]); // ERROR!
```

# also

This [[tuner]] lets you add more variations using the same signature as the constructor.

```ts title:boolean.also.ts
boolean("on", "off").also("enabled", "disabled").also(["yes", "no"], ["T", "F"]);
```
