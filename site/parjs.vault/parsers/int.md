---
cssclasses:
---
#stage-4
This #🧩parser lets you parse integers in base 10, together with a sign character. It can’t parse scientific notation.

# sign(enabled = true)
This [[tuner]] lets you turn off parsing the sign character.

```ts title:int.sign.ts
int.sign(false).parse("12345"); // 12345
```

# base(base = 10)
This [[tuner]] lets you parse integers in bases other than base 10, up to 36. Letter characters are case-insensitive by default.

```ts title:int.base.ts
int.base(16).parse("F1f");
```

# type(type = "number")
This [[tuner]] lets you pick between three output types:
1. `"number"` — the integer will be returned as a `number` (default).
2. `"string"` — the integer will be returned as a `string`.
3. `"bigint"` — the integer will be returned as a `bigint`.

```ts title:int.type.ts
int.type("bigint").parse(
    "1234567891011121314151617181920"
) // 1234567891011121314151617181920n
```