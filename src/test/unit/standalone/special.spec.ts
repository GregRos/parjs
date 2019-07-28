import {ResultKind} from "../../../lib/internal/result";
import {expectFailure, expectSuccess} from "../../helpers/custom-matchers";
import {eof, fail, position, result, state, string} from "../../../lib/internal/parsers";
import {later, then} from "../../../lib/combinators";

describe("special parsers", () => {
    describe("Parjs.eof", () => {
        let parser = eof();
        let fail = "a";
        let success = "";
        it("success on empty input", () => {
            expectSuccess(parser.parse(success), undefined);
        });
        it("fail on non-empty input", () => {
            expectFailure(parser.parse(fail), ResultKind.SoftFail);
        });
        it("chain multiple EOF succeeds", () => {
            let parser2 = parser.pipe(
                then(eof())
            );
            expectSuccess(parser2.parse(""), undefined);
        });
    });

    describe("internal.state", () => {
        let parser = state();
        let uState = {tag: 1};
        let someInput = "abcd";
        let noInput = "";
        it("fails on non-empty input", () => {
            let result = parser.parse(someInput, uState);
            expectFailure(result);
        });
    });

    describe("position", () => {
        let parser = position();
        let noInput = "";
        it("succeeds on empty input", () => {
            let result = parser.parse(noInput);
            expectSuccess(result, 0);
        });
        it("fails on non-empty input", () => {
            let result = parser.parse("abc");
            expectFailure(result);
        });
    });

    describe("Parjs.result(x)", () => {
        let parser = result("x");
        let noInput = "";
        it("succeeds on empty input", () => {
            expectSuccess(parser.parse(noInput), "x");
        });
        it("fails on non-empty input", () => {
            expectFailure(parser.parse("a"));
        });
    });

    describe("fail", () => {
        let parser = fail({
            kind: "Fatal"
        });
        let noInput = "";
        let input = "abc";
        it("fails on no input", () => {
            expectFailure(parser.parse(noInput), ResultKind.FatalFail);
        });
        it("fails on non-empty input", () => {
            expectFailure(parser.parse(input), ResultKind.FatalFail);
        });
    });

    describe("Parjs.later", () => {
        let s = "";
        let parser = later<any>();
        let internal = string("a");

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
            expect((parser as any).expecting).toEqual((internal as any).expecting);
        });
    });
});
