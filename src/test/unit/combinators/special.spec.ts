import { expectFailure, expectSuccess } from "../../helpers/custom-matchers";
import { eof, string } from "../../../lib";
import { backtrack, each, replaceState, map, then } from "../../../lib/combinators";
describe("special combinators", () => {
    describe("backtrack", () => {
        const parser = string("hi").pipe(then(eof()), backtrack());

        it("fails soft if inner fails soft", () => {
            expectFailure(parser.parse("x"), "Soft");
        });

        it("fails hard if inner fails hard", () => {
            expectFailure(parser.parse("hiAQ"), "Hard");
        });

        it("succeeds if inner succeeds, non-zero match", () => {
            const parseHi = string("hi");
            const redundantParser = parseHi.pipe(backtrack(), then("his"));
            expectSuccess(redundantParser.parse("his"), ["hi", "his"]);
        });
    });

    describe("isolate state", () => {
        it("works", () => {
            const parser = string("hi").pipe(
                each((_x, u) => {
                    expect(u.innerState).toBe(1, "innerState is set inside isolation");
                    expect(u.outerState).toBeUndefined("outerStste unset inside insolation");
                }),
                replaceState({ innerState: 1 }),
                map((_x, u) => {
                    expect(u.outerState).toBe(1, "outerState set inside isolation");
                    expect(u.innerState).toBeUndefined("innerState unset inside isolation");
                    return u;
                })
            );

            const result = parser.parse("hi", {
                outerState: 1
            }).value;
            expect(result.outerState).toBe(1);
        });
    });
});
