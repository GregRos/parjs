import {anyChar, anyStringOf, string} from "../../lib/internal/parsers";
import {or, then} from "../../lib/combinators";

let example = string("a").pipe(
    then(
        or("b")("c")
    )
);

console.log(example.parse("ab").toString());
