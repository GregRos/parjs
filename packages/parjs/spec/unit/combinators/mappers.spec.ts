import { anyCharOf, eof, result, ResultKind, string, stringLen } from "@lib";
import { each, map, stringify } from "@lib/combinators";

const goodInput = "abcd";
const badInput = "";
const uState = {};
const loudParser = stringLen(4);

describe("map combinators", () => {
    describe("map", () => {
        const parser = loudParser.pipe(map(() => 1));
        it("maps on success", () => {
            expect(parser.parse(goodInput, uState)).toBeSuccessful(1);
        });
        it("fails on failure", () => {
            expect(parser.parse(badInput, uState)).toBeFailure(ResultKind.SoftFail);
        });
    });

    describe("cast", () => {
        const parser = loudParser.pipe(map(x => x as unknown as number));
        it("maps on success", () => {
            expect(parser.parse(goodInput)).toBeSuccessful("abcd" as never);
        });
        it("fails on failure", () => {
            expect(parser.parse(badInput)).toBeFailure();
        });
    });

    describe("stringify", () => {
        it("quiet", () => {
            const p = eof().pipe(map(() => ""));
            expect(p.parse("")).toBeSuccessful("");
        });

        it("array", () => {
            const p = result(["a", "b", "c"]).pipe(stringify());
            expect(p.parse("")).toBeSuccessful("abc");
        });

        it("nested array", () => {
            const p = result(["a", ["b", ["c"], "d"], "e"]).pipe(stringify());
            expect(p.parse("")).toBeSuccessful("abcde");
        });

        it("null", () => {
            const p = result(null).pipe(stringify());
            expect(p.parse("")).toBeSuccessful("null");
        });

        it("undefined", () => {
            const p = result(undefined).pipe(stringify());
            expect(p.parse("")).toBeSuccessful("undefined");
        });

        it("string", () => {
            const p = string("a").pipe(stringify());
            expect(p.parse("a")).toBeSuccessful("a");
        });

        it("object", () => {
            const p = result({}).pipe(stringify());
            expect(p.parse("")).toBeSuccessful({}.toString());
        });
    });

    describe("each", () => {
        let tally = "";
        const p = anyCharOf("abc").pipe(
            each((res, state) => {
                tally += res;
                state.char = res;
            })
        );
        it("works", () => {
            expect(p.parse("a")).toBeSuccessful("a");
            expect(tally).toBe("a");
            expect(p.parse("b")).toBeSuccessful("b");
            expect(tally).toBe("ab");
            expect(p.parse("d")).toBeFailure("Soft");
            expect(tally).toBe("ab");
        });
    });
});
