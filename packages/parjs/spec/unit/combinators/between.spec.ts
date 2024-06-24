import { ResultKind, float, string } from "@lib";
import { between } from "@lib/combinators";

describe("the between combinators", () => {
    describe("two argument version", () => {
        const parser = string("a").pipe(between("(", string(")")));
        it("succeeds", () => {
            expect(parser.parse("(a)")).toBeSuccessful("a");
        });
        it("fails soft if first between fails", () => {
            expect(parser.parse("[a)")).toBeFailure(ResultKind.SoftFail);
        });
        it("fails hard if middle/last fails", () => {
            expect(parser.parse("(b)")).toBeFailure(ResultKind.HardFail);
            expect(parser.parse("(b]")).toBeFailure(ResultKind.HardFail);
        });
    });
    describe("one argument version", () => {
        const parser = string("a").pipe(between("!"));
        it("succeeds", () => {
            expect(parser.parse("!a!")).toBeSuccessful("a");
        });
    });

    describe("two argument version with different types", () => {
        const parser = string("a").pipe(between("_", float()));
        it("succeeds", () => {
            expect(parser.parse("_a3.14")).toBeSuccessful("a");
        });
    });
});
