#stage-4
This #🧩parser parses a string from one or more input strings, **yielding the string that was parsed.** The parser will try to parse each of the strings in the order in which they are given.

```ts title:string.ts
import { string } from "parjs";

string("hello", "goodbye").parse("goodbye"); // "goodbye"

string("hello", "h").parse("hello"); // "hello"
```

# [[implicit conversion]]

This constructor is used to implicitly convert string values when they appear as parser inputs.

# or

This [[tuner]] can be used to extend the array of strings with additional values.

```ts title:string.also.ts
string("hello").or("goodbye").parse("goodbye"); // "goodbye"
```
