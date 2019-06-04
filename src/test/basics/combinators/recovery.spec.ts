/**
 * Created by lifeg on 12/12/2016.
 */
import {expectFailure, expectSuccess} from "../../helpers/custom-matchers";
import {LoudParser} from "../../../lib/loud";
import {Parjs} from "../../../lib";
import {ReplyKind} from "../../../lib/reply";
import {AnyParser} from "../../../lib/any";


function forParser<TParser extends AnyParser>(parser: TParser, f: (action: TParser) => void) {
    describe(`Parjs.${parser.displayName}`, () => {
        f(parser);
    });
}

describe("maybe combinator", () => {
    it("works", () => {
        let p = Parjs.string("a").q;
        let m = p.maybe();
        expectSuccess(m.parse("a"));
        expectSuccess(m.parse(""));
    });

    it("causes progress on success", () => {
        let p = Parjs.string("abc").q.maybe().then("123");
        expectSuccess(p.parse("abc123"), "123");
    });

    it("propagates hard failure", () => {
        let p = Parjs.fail("intentional", ReplyKind.HardFail).q.maybe();
        expectFailure(p.parse(""), ReplyKind.HardFail);
    });
});

describe("or combinator", () => {
    it("guards against loud-quiet parser mixing", () => {
        expect(() => Parjs.any(Parjs.digit as any, Parjs.digit.q)).toThrow();
    });
    it("guards against quiet-orVal", () => {
        expect(() => (Parjs.eof as any as LoudParser<any>).maybe(1)).toThrow();
    });

    describe("loud or loud", () => {
        let parser = Parjs.string("ab").or("cd");
        it("succeeds parsing 1st option", () => {
            expectSuccess(parser.parse("ab"), "ab");
        });
        it("suceeds parsing 2nd option", () => {
            expectSuccess(parser.parse("cd"), "cd");
        });
        it("fails parsing both", () => {
            expectFailure(parser.parse("ef"), ReplyKind.SoftFail);
        });
        it("fails hard when 1st fails hard", () => {
            let parser2 = Parjs.fail("fail", ReplyKind.HardFail).result("x").or("ab");
            expectFailure(parser2.parse("ab"), ReplyKind.HardFail);
        });
        let parser2 = Parjs.string("ab").or(Parjs.fail("x", ReplyKind.HardFail));
        it("succeeds with 2nd would've failed hard", () => {
            expectSuccess(parser2.parse("ab"), "ab");
        });
        it("fails when 2nd fails hard", () => {
            expectFailure(parser2.parse("cd"), ReplyKind.HardFail);
        });
    });

    describe("quiet or quiet", () => {
        let parser = Parjs.string("ab").q.or(Parjs.string("cd").q);
        it("succeeds parsing 2nd, no return", () => {
            expectSuccess(parser.parse("cd"), undefined);
        });
    });
});

describe("or val combinator", () => {
    let parser = Parjs.string("a").then("b").str.maybe("c");

    let p2 = Parjs.string("a").maybe(0).then("b");
    it("succeeds to parse", () => {
        expectSuccess(parser.parse("ab"), "ab");
    });

    it("if first fails hard, then fail hard", () => {
        expectFailure(parser.parse("ax"), ReplyKind.HardFail);
    });

    it("if first fail soft, then return value", () => {
        expectSuccess(parser.parse(""), "c");
    });

    it("falsy alt value", () => {
        let result = p2.parse("b");
        expectSuccess(result, [0, "b"]);
    });
});

describe("not combinator", () => {
    let parser = Parjs.string("a").then("b").str.not;
    it("succeeds on empty input/soft fail", () => {
        expectSuccess(parser.parse(""), undefined);
    });
    it("succeeds on hard fail if we take care of the rest", () => {
        let parser2 = parser.then(Parjs.rest);
        expectSuccess(parser2.parse("a"));
    });
    it("soft fails on passing input", () => {
        expectFailure(parser.parse("ab"), ReplyKind.SoftFail);
    });
    it("fails fatally on fatal fail", () => {
        let parser2 = Parjs.fail("fatal", ReplyKind.FatalFail).not;
        expectFailure(parser2.parse(""), ReplyKind.FatalFail);
    });
    it("fails on too much input", () => {
        expectFailure(parser.parse("a"), ReplyKind.SoftFail);
    });
});

describe("soft combinator", () => {
    let parser = Parjs.string("a").then("b").str.soft;
    it("succeeds", () => {
        expectSuccess(parser.parse("ab"), "ab");
    });
    it("fails softly on soft fail", () => {
        expectFailure(parser.parse("ba"), ReplyKind.SoftFail);
    });
    it("fails softly on hard fail", () => {
        expectFailure(parser.parse("a"), ReplyKind.SoftFail);
    });
    it("fails fatally on fatal fail", () => {
        let parser2 = Parjs.fail("fatal", ReplyKind.FatalFail).soft;
        expectFailure(parser2.parse(""), ReplyKind.FatalFail);
    });
});