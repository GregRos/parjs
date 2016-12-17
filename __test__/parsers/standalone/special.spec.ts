import {ResultKind} from "../../../src/abstract/basics/result";
import {verifyFailure, verifySuccess} from "../../custom-matchers";
import {Parjs} from "../../../src/bindings/parsers";
import {AnyParser} from "../../../src/abstract/combinators/any";
/**
 * Created by lifeg on 16/12/2016.
 */
function forParser<TParser extends AnyParser>(parser : TParser, f : (action : TParser) => void) {
    describe(`Parjs.${parser.displayName}`, () => {
        f(parser);
    });
}

describe("special parsers", () => {
    forParser(Parjs.eof, parser => {
        let fail = "a";
        let success = "";
        it("success on empty input", () => {
            verifySuccess(parser.parse(success), undefined);
        });
        it("fail on non-empty input", () => {
            verifyFailure(parser.parse(fail), ResultKind.SoftFail);
        });
    });

    forParser(Parjs.state, parser => {
        let uState = {};
        let someInput = "abcd";
        let noInput = "";
        it("succeeds on empty input", () => {
            let result = parser.parse(noInput, uState);
            verifySuccess(result, uState);
        });
        it("fails on non-empty input", () => {
            let result = parser.parse(someInput, uState);
            verifyFailure(result);
        });
    });

    forParser(Parjs.position, parser => {
        let noInput = "";
        it("succeeds on empty input", () => {
            let result = parser.parse(noInput);
            verifySuccess(result, 0);
        });
        it("fails on non-empty input", () => {
            let result = parser.parse("abc");
            verifyFailure(result);
        })
    });

    forParser(Parjs.result("x"), parser => {
        let noInput = "";
        it("succeeds on empty input", () => {
            verifySuccess(parser.parse(noInput), "x");
        });
        it("fails on non-empty input", () => {
            verifyFailure(parser.parse("a"));
        })
    });

    forParser(Parjs.fail("error", ResultKind.FatalFail), parser => {
        let noInput = "";
        let input = "abc";
        it("fails on no input", () => {
            verifyFailure(parser.parse(noInput), ResultKind.FatalFail);
        });
        it("fails on non-empty input", () => {
            verifyFailure(parser.parse(input), ResultKind.FatalFail);
        });
    });
});