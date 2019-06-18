import {anyChar, anyStringOf, string} from "../../lib/internal/parsers";
import {then} from "../../lib/combinators";

let p = string("a").pipe(
    then("b")
);
console.log(p.parse("ac").toString());
