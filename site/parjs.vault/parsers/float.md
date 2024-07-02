#stage-4
This #🧩parser parses a floating point number written in ASCII characters. The default options parse a floating point number such as `-1.4`, `+1.2`, or `1.7`. That is, both fractional and whole part are required, while scientific notation is not supported.

# sci
This [[tuner]] lets you turn on parsing scientific notation, like `1.25E+10`.

```ts title:float.sci.ts
float.sci(true).parse("1.25E+10");
```

# sign
This [[tuner]] lets you turn off parsing the sign character.

```ts title:float.sign.ts
float.sign(false).parse("1.5");
```

# implicit
This [[tuner]] lets you turn on parsing implicit float notation, like `.1` and `1.`.

```ts title:float.implicit.ts
float.implicit(true).parse(".5");
```

# names
This [[tuner]] turns on parsing the strings `"NaN"` `"Infinity"`, and `"-Infinity"` as floating point values.