/**
 * Created by lifeg on 12/12/2016.
 */
import {expectFailure, expectSuccess} from "../../helpers/custom-matchers";
import {Parjser} from "../../../lib/parjser";
import {ReplyKind} from "../../../lib/reply";
import {string, fail, rest} from "../../../lib/internal/parsers";
import {mapConst, maybe, not, or, qthen, soft, str, then} from "../../../lib/combinators";


describe("maybe combinator", () => {
    it("works", () => {
        let p = string("a");
        let m = p.pipe(
            maybe()
        );
        expectSuccess(m.parse("a"));
        expectSuccess(m.parse(""));
    });

    it("causes progress on success", () => {
        let p = string("abc").pipe(
            maybe(),
            qthen("123")
        );
        expectSuccess(p.parse("abc123"), "123");
    });

    it("propagates hard failure", () => {
        let p = fail("intentional", ReplyKind.HardFail).pipe(
            maybe()
        );
        expectFailure(p.parse(""), ReplyKind.HardFail);
    });
});

describe("or combinator", () => {
    describe("loud or loud", () => {
        let parser = string("ab").pipe(
            or("cd")
        );
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
            let parser2 = fail("fail", ReplyKind.HardFail).pipe(
                mapConst("x"),
                or("ab")
            );
            expectFailure(parser2.parse("ab"), ReplyKind.HardFail);
        });
        let parser2 = string("ab").pipe(
            or(fail("x", ReplyKind.HardFail))
        );
        it("succeeds with 2nd would've failed hard", () => {
            expectSuccess(parser2.parse("ab"), "ab");
        });
        it("fails when 2nd fails hard", () => {
            expectFailure(parser2.parse("cd"), ReplyKind.HardFail);
        });
    });
});

describe("or val combinator", () => {
    let parser = string("a").pipe(
        then("b"),
        str(),
        maybe("c")
    );

    let p2 = string("a").pipe(
        maybe(0),
        then("b")
    );
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
    let parser = string("a").pipe(
        then("b"),
        str(),
        not()
    );
    it("succeeds on empty input/soft fail", () => {
        expectSuccess(parser.parse(""), undefined);
    });
    it("succeeds on hard fail if we take care of the rest", () => {
        let parser2 = parser.pipe(
            then(rest())
        );
        expectSuccess(parser2.parse("a"));
    });
    it("soft fails on passing input", () => {
        expectFailure(parser.parse("ab"), ReplyKind.SoftFail);
    });
    it("fails fatally on fatal fail", () => {
        let parser2 = fail("fatal", ReplyKind.FatalFail).pipe(
            not()
        );
        expectFailure(parser2.parse(""), ReplyKind.FatalFail);
    });
    it("fails on too much input", () => {
        expectFailure(parser.parse("a"), ReplyKind.SoftFail);
    });
});

describe("soft combinator", () => {
    let parser = string("a").pipe(
        then("b"),
        str(),
        soft()
    );
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
        let parser2 = fail("fatal", ReplyKind.FatalFail).pipe(
            soft()
        );
        expectFailure(parser2.parse(""), ReplyKind.FatalFail);
    });
});
