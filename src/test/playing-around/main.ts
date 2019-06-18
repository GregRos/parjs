import {anyChar, anyStringOf, string} from "../../lib/internal/parsers";
import {or, then} from "../../lib/combinators";

let p = or("a")("b");
console.log(p.parse("a").toString());
