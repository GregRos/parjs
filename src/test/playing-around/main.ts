import { string } from "../../lib/internal/parsers";
import { or, then } from "../../lib/combinators";

const example = string("a").pipe(then(or("b")("c")));

console.log(example.parse("ab").toString());
