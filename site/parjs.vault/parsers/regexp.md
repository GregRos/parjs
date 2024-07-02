#stage-4
This #🧩parser okays a regular expression as an input. When invoked, it will try to apply the regular expression **at the current position** and yield the captured text. 

If the regular expressions fails to match, the parser [[signal/fail|⛔‍fails]].

```ts title:regexp.ts
import {regexp} from "parjs"

regexp(/abc/).parse("abc") // "abc"
```

[[regexp]] will ignore the `g` flag entirely and add the `y` flag whether it’s present or not. Other flags will behave as normal, as will `$` and `^`.
# map
This [[tuner]] lets you apply a projection on the **capture groups** returned by the regular expression. It receives an object containing a key for each capture group, with `0` being the entire capture.

```ts title:regexp.map.ts
import {regexp} from "parjs"

regexp(
    /(?<greeting>hello) (\w+)/
).map(m => [m.greeting, m.1])
```