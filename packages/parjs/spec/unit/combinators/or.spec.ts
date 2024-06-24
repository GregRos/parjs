import type { ParjsFailure } from "@lib";
import { fail, ResultKind, string } from "@lib";
import { mapConst, or } from "@lib/combinators";

describe("or combinator", () => {
    describe("loud or loud", () => {
        const parser = string("ab").pipe(or("cd"));
        it("succeeds parsing 1st option", () => {
            expect(parser.parse("ab")).toBeSuccessful("ab");
        });
        it("suceeds parsing 2nd option", () => {
            expect(parser.parse("cd")).toBeSuccessful("cd");
        });
        it("fails parsing both", () => {
            expect(parser.parse("ef")).toBeFailure(ResultKind.SoftFail);
        });
        it("fails hard when 1st fails hard", () => {
            const parser2 = fail({
                reason: "fail",
                kind: ResultKind.HardFail
            }).pipe(mapConst("x"), or("ab"));
            expect(parser2.parse("ab")).toBeFailure(ResultKind.HardFail);
        });
        const parser2 = string("ab").pipe(
            or(
                fail({
                    reason: "x",
                    kind: "Hard"
                })
            )
        );
        it("succeeds with 2nd would've failed hard", () => {
            expect(parser2.parse("ab")).toBeSuccessful("ab");
        });
        it("fails when 2nd fails hard", () => {
            expect(parser2.parse("cd")).toBeFailure(ResultKind.HardFail);
        });
        it("reason includes all expecting", () => {
            const reasons = ["it broke", "nope", "not this", "not that"];
            const allFails = reasons.map(x =>
                fail({
                    reason: x,
                    kind: "Soft"
                })
            );
            const parser3 = allFails[0].pipe(or(allFails[1], allFails[2], allFails[3]));
            const result = parser3.parse("a") as ParjsFailure;
            expect(result.reason).toBe(reasons.join(" OR "));
        });
    });
});
