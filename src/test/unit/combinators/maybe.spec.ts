import type { Parjser } from "../../../lib";
import { ResultKind, fail, string } from "../../../lib";
import { maybe, qthen, stringify, then } from "../../../lib/combinators";

describe("maybe combinator", () => {
    it("works", () => {
        const p = string("a");
        const m = p.pipe(maybe());
        expect(m.parse("a")).toBeSuccessful();
        expect(m.parse("")).toBeSuccessful();
    });

    it("causes progress on success", () => {
        const p = string("abc").pipe(maybe(), qthen("123"));
        expect(p.parse("abc123")).toBeSuccessful("123");
    });

    it("propagates hard failure", () => {
        const p = fail().pipe(maybe());
        expect(p.parse("")).toBeFailure(ResultKind.HardFail);
    });
});

describe("maybe combinator again", () => {
    const parser = string("a").pipe(then("b"), stringify(), maybe("c"));

    const p2: Parjser<[0 | "a", "b"]> = string("a").pipe(maybe(0), then(string("b")));
    it("succeeds to parse", () => {
        expect(parser.parse("ab")).toBeSuccessful("ab");
    });

    it("if first fails hard, then fail hard", () => {
        expect(parser.parse("ax")).toBeFailure(ResultKind.HardFail);
    });

    it("if first fail soft, then return value", () => {
        expect(parser.parse("")).toBeSuccessful("c");
    });

    it("falsy alt value", () => {
        const result = p2.parse("b");
        expect(result).toBeSuccessful([0, "b"]);
    });
});
