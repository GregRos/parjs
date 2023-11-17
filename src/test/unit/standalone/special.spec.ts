import { later, then } from "../../../lib/combinators";
import { ParjserBase } from "../../../lib/internal";
import { eof, fail, position, result, state, string } from "../../../lib/internal/parsers";
import { ResultKind } from "../../../lib/internal/result";

describe("special parsers", () => {
    describe("Parjs.eof", () => {
        const parser = eof();
        const failInput = "a";
        const successInput = "";
        it("success on empty input", () => {
            expect(parser.parse(successInput)).toBeSuccessful(undefined);
        });
        it("fail on non-empty input", () => {
            expect(parser.parse(failInput)).toBeFailure(ResultKind.SoftFail);
        });
        it("chain multiple EOF succeeds", () => {
            const parser2 = parser.pipe(then(eof()));
            expect(parser2.parse("")).toBeSuccessful(undefined);
        });
    });

    describe("internal.state", () => {
        const parser = state();
        const uState = { tag: 1 };
        const someInput = "abcd";
        it("fails on non-empty input", () => {
            const parseResult = parser.parse(someInput, uState);
            expect(parseResult).toBeFailure();
        });
    });

    describe("position", () => {
        const parser = position();
        const noInput = "";
        it("succeeds on empty input", () => {
            const parseResult = parser.parse(noInput);
            expect(parseResult).toBeSuccessful(0);
        });
        it("fails on non-empty input", () => {
            const parseResult = parser.parse("abc");
            expect(parseResult).toBeFailure();
        });
    });

    describe("Parjs.result(x)", () => {
        const parser = result("x");
        const noInput = "";
        it("succeeds on empty input", () => {
            expect(parser.parse(noInput)).toBeSuccessful("x");
        });
        it("fails on non-empty input", () => {
            expect(parser.parse("a")).toBeFailure();
        });
    });

    describe("fail", () => {
        const parser = fail({
            kind: "Fatal"
        });
        const noInput = "";
        const input = "abc";
        it("fails on no input", () => {
            expect(parser.parse(noInput)).toBeFailure(ResultKind.FatalFail);
        });
        it("fails on non-empty input", () => {
            expect(parser.parse(input)).toBeFailure(ResultKind.FatalFail);
        });
    });

    describe("Parjs.later", () => {
        const internal = string("a") as ParjserBase<string>;
        const parser = later<string>();

        it("throws when not init", () => {
            expect(() => later().parse("")).toThrow();
        });

        parser.init(internal);

        it("throws when double init", () => {
            expect(() => parser.init(internal)).toThrow();
        });

        it("first success", () => {
            expect(parser.parse("a")).toBeSuccessful("a");
        });

        it("second success", () => {
            expect(parser.parse("a")).toBeSuccessful("a");
        });

        it("fail", () => {
            expect(parser.parse("")).toBeFailure("Soft");
        });

        it("expecting after init", () => {
            expect((parser as unknown as ParjserBase<string>).expecting).toEqual(
                internal.expecting
            );
        });
    });
});
