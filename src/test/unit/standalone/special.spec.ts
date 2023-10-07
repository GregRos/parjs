import { ResultKind } from "../../../lib/internal/result";
import { expectFailure, expectSuccess } from "../../helpers/custom-matchers";
import { eof, fail, position, result, state, string } from "../../../lib/internal/parsers";
import { later, then } from "../../../lib/combinators";
import { ParjserBase } from "../../../lib/internal";

describe("special parsers", () => {
    describe("Parjs.eof", () => {
        const parser = eof();
        const failInput = "a";
        const successInput = "";
        it("success on empty input", () => {
            expectSuccess(parser.parse(successInput), undefined);
        });
        it("fail on non-empty input", () => {
            expectFailure(parser.parse(failInput), ResultKind.SoftFail);
        });
        it("chain multiple EOF succeeds", () => {
            const parser2 = parser.pipe(then(eof()));
            expectSuccess(parser2.parse(""), undefined);
        });
    });

    describe("internal.state", () => {
        const parser = state();
        const uState = { tag: 1 };
        const someInput = "abcd";
        it("fails on non-empty input", () => {
            const parseResult = parser.parse(someInput, uState);
            expectFailure(parseResult);
        });
    });

    describe("position", () => {
        const parser = position();
        const noInput = "";
        it("succeeds on empty input", () => {
            const parseResult = parser.parse(noInput);
            expectSuccess(parseResult, 0);
        });
        it("fails on non-empty input", () => {
            const parseResult = parser.parse("abc");
            expectFailure(parseResult);
        });
    });

    describe("Parjs.result(x)", () => {
        const parser = result("x");
        const noInput = "";
        it("succeeds on empty input", () => {
            expectSuccess(parser.parse(noInput), "x");
        });
        it("fails on non-empty input", () => {
            expectFailure(parser.parse("a"));
        });
    });

    describe("fail", () => {
        const parser = fail({
            kind: "Fatal"
        });
        const noInput = "";
        const input = "abc";
        it("fails on no input", () => {
            expectFailure(parser.parse(noInput), ResultKind.FatalFail);
        });
        it("fails on non-empty input", () => {
            expectFailure(parser.parse(input), ResultKind.FatalFail);
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
            expectSuccess(parser.parse("a"), "a");
        });

        it("second success", () => {
            expectSuccess(parser.parse("a"), "a");
        });

        it("fail", () => {
            expectFailure(parser.parse(""), "Soft");
        });

        it("expecting after init", () => {
            expect((parser as unknown as ParjserBase<string>).expecting).toEqual(
                internal.expecting
            );
        });
    });
});
