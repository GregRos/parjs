import { eof, string } from "@lib";
import { backtrack, each, map, replaceState, then } from "@lib/combinators";

describe("special combinators", () => {
    describe("backtrack", () => {
        const parser = string("hi").pipe(then(eof()), backtrack());

        it("fails soft if inner fails soft", () => {
            expect(parser.parse("x")).toBeFailure("Soft");
        });

        it("fails hard if inner fails hard", () => {
            expect(parser.parse("hiAQ")).toBeFailure("Hard");
        });

        it("succeeds if inner succeeds, non-zero match", () => {
            const parseHi = string("hi");
            const redundantParser = parseHi.pipe(backtrack(), then("his"));
            expect(redundantParser.parse("his")).toBeSuccessful(["hi", "his"]);
        });
    });

    describe("isolate state", () => {
        it("works", () => {
            const parser = string("hi").pipe(
                each((_x, u) => {
                    // innerState is set inside isolation
                    expect(u.innerState).toBe(1);

                    // outerStste unset inside insolation
                    expect(u.outerState).toBeUndefined();
                }),
                replaceState({ innerState: 1 }),
                map((_x, u) => {
                    // outerState set inside isolation
                    expect(u.outerState).toBe(1);

                    // innerState unset inside isolation
                    expect(u.innerState).toBeUndefined();
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
