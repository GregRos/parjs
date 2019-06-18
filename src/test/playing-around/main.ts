import {anyChar} from "../../lib/internal/parsers";

console.log(anyChar().parse(""));

console.log(new Error("a"));
