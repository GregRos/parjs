import type { Parjser, ParjsFailure } from "@lib";
import { fail, nope, rest, ResultKind, string } from "@lib";
import {
    mapConst,
    maybe,
    not,
    or,
    qthen,
    reason,
    recover,
    stringify,
    thenceforth
} from "@lib/combinators";

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

describe("or val combinator", () => {
    const parser = string("a").pipe(thenceforth("b"), stringify(), maybe("c"));

    const p2: Parjser<[0 | "a", "b"]> = string("a").pipe(maybe(0), thenceforth(string("b")));
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

describe("not combinator", () => {
    const parser = string("a").pipe(thenceforth("b"), stringify(), not());
    it("succeeds on empty input/soft fail", () => {
        expect(parser.parse("")).toBeSuccessful(undefined);
    });
    it("succeeds on hard fail if we take care of the rest", () => {
        const parser2 = parser.pipe(thenceforth(rest()));
        expect(parser2.parse("a")).toBeSuccessful();
    });
    it("soft fails on passing input", () => {
        expect(parser.parse("ab")).toBeFailure(ResultKind.SoftFail);
    });
    it("fails fatally on fatal fail", () => {
        const parser2 = fail({
            kind: "Fatal",
            reason: "fatal"
        }).pipe(not());
        expect(parser2.parse("")).toBeFailure(ResultKind.FatalFail);
    });
    it("fails on too much input", () => {
        expect(parser.parse("a")).toBeFailure(ResultKind.SoftFail);
    });
});

describe("soft combinator", () => {
    const parser = string("a").pipe(
        thenceforth("b"),
        stringify(),
        recover(() => ({ kind: "Soft" }))
    );
    it("succeeds", () => {
        expect(parser.parse("ab")).toBeSuccessful("ab");
        expect(parser.parse("ab")).toBeSuccessful("ab");
    });
    it("fails softly on soft fail", () => {
        expect(parser.parse("ba")).toBeFailure(ResultKind.SoftFail);
    });
    it("fails softly on hard fail", () => {
        expect(parser.parse("a")).toBeFailure(ResultKind.SoftFail);
    });
    it("fails fatally on fatal fail", () => {
        const parser2 = fail({
            kind: "Fatal"
        }).pipe(recover(() => ({ kind: "Soft" })));
        expect(parser2.parse("")).toBeFailure(ResultKind.FatalFail);
    });
});

describe("expects combinator", () => {
    const base = nope("deez nuts");
    it("sets the expecting", () => {
        const parser = base.pipe(reason("imma let you finish"));

        expect(parser.parse("abc")).toMatchObject({
            kind: "Soft",
            reason: "imma let you finish"
        });
    });
    it("modifies expecting", () => {
        const parser = base.pipe(
            thenceforth(fail("deez nuts")),
            reason(x => `${x.reason}! gottem!`)
        );
        expect(parser.parse("abc")).toMatchObject({
            kind: "Soft",
            reason: "deez nuts! gottem!"
        });
    });
});
