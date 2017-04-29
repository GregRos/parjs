import {ReplyKind} from "../../../src/reply";
import {expectFailure, expectSuccess} from "../../custom-matchers";
import {Parjs} from "../../../src";
import {AnyParser} from "../../../src/any";
/**
 * Created by lifeg on 16/12/2016.
 */
function forParser<TParser extends AnyParser>(parser : TParser, f : (action : TParser) => void) {
    describe(`Parjs.${parser.displayName}`, () => {
        f(parser);
    });
}

describe("special parsers", () => {
    describe("Parjs.eof", () => {
        let parser = Parjs.eof;
        let fail = "a";
        let success = "";
        it("success on empty input", () => {
            expectSuccess(parser.parse(success), undefined);
        });
        it("fail on non-empty input", () => {
            expectFailure(parser.parse(fail), ReplyKind.SoftFail);
        });
        it("chain multiple EOF succeeds", () => {
            let parser2 = parser.then(Parjs.eof);
            expectSuccess(parser2.parse(""), undefined);
        })
    });

    describe("Parjs.state", () => {
        let parser = Parjs.state;
        let uState = {tag : 1};
        let someInput = "abcd";
        let noInput = "";
        it("fails on non-empty input", () => {
            let result = parser.parse(someInput, uState);
            expectFailure(result);
        });
    });

    describe("Parjs.position", ()=> {
        let parser = Parjs.position;
        let noInput = "";
        it("succeeds on empty input", () => {
            let result = parser.parse(noInput);
            expectSuccess(result, 0);
        });
        it("fails on non-empty input", () => {
            let result = parser.parse("abc");
            expectFailure(result);
        })
    });

    describe("Parjs.result(x)", () => {
        let parser = Parjs.result("x");
        let noInput = "";
        it("succeeds on empty input", () => {
            expectSuccess(parser.parse(noInput), "x");
        });
        it("fails on non-empty input", () => {
            expectFailure(parser.parse("a"));
        })
    });

    describe("Parjs.fail", ()=> {
        let parser = Parjs.fail("error", "FatalFail");
        let noInput = "";
        let input = "abc";
        it("fails on no input", () => {
            expectFailure(parser.parse(noInput), ReplyKind.FatalFail);
        });
        it("fails on non-empty input", () => {
            expectFailure(parser.parse(input), ReplyKind.FatalFail);
        });
    });

    describe("Parjs.nop", () => {
        let parser = Parjs.nop;
        it("succeeds on no input", () => {
            expectSuccess(parser.parse(""));
        });
        it("fails on input", () => {
            expectFailure(parser.parse(" "), "SoftFail");
        })
    });

    describe("Parjs.late", () => {
        let s = "";
        let parser = Parjs.late(() => {
            s += "a";
            return Parjs.string(s);
        });

        it("first success", () => {
            expectSuccess(parser.parse("a"), "a");
        });

        it("second success", () => {
            expectSuccess(parser.parse("a"), "a");
        });

        it("fail", () => {
            expectFailure(parser.parse(""), "SoftFail");
        })
    })
});