import {expectFailure, expectSuccess} from "../../helpers/custom-matchers";
import {eof, state, string} from "../../../lib";
import {backtrack, each, isolateState, map, must, then} from "../../../lib/combinators";

let goodInput = "abcd";
describe("special combinators", () => {
    describe("backtrack", () => {
        let parser = string("hi").pipe(
            then(eof()),
            backtrack()
        );

        it("fails soft if inner fails soft", () => {
            expectFailure(parser.parse("x"), "Soft");
        });

        it("fails hard if inner fails hard", () => {
            expectFailure(parser.parse("hiAQ"), "Hard");
        });

        it("succeeds if inner succeeds, non-zero match", () => {
            let parseHi = string("hi");
            let redundantParser = parseHi.pipe(
                backtrack(),
                then("his")
            );
            expectSuccess(redundantParser.parse("his"), ["hi", "his"]);
        });
    });

    describe("isolate state", () => {
        it("works", () => {
            let parser = string("hi").pipe(
                each((x, u) => {
                    expect(u.innerState).toBe(1, "innerState is set inside isolation");
                    expect(u.outerState).toBeUndefined("outerStste unset inside insolation");
                }),
                isolateState({ innerState: 1}),
                map((x, u) => {
                    expect(u.outerState).toBe(1, "outerState set inside isolation");
                    expect(u.innerState).toBeUndefined("innerState unset inside isolation");
                    return u;
                })
            );

            let result = parser.parse("hi", {
                outerState: 1
            }).value;
            expect(result.outerState).toBe(1);
        });

        it("deep clones state", () => {
            let toBeCloned = { innerState: 2};
            let parser = string("hi").pipe(
                map((x, u) => {
                    u.innerState = 1;
                    return u;
                }),
                isolateState(toBeCloned)
            );
            let result = parser.parse("hi").value;
            expect(result.innerState).toBe(1);
            expect(toBeCloned.innerState).toBe(2);
        });
    });


});
