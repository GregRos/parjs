/**
 * Created by lifeg on 12/12/2016.
 */
import {expectFailure, expectSuccess} from "../../helpers/custom-matchers";
import {Parjser} from "../../../lib/parjser";
import {ResultKind} from "../../../lib/internal/reply";
import {string, fail, rest} from "../../../lib/internal/parsers";
import {mapConst, maybe, not, or, qthen, soft, stringify, then} from "../../../lib/combinators";


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
        let p = fail().pipe(
            maybe()
        );
        expectFailure(p.parse(""), ResultKind.HardFail);
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
            expectFailure(parser.parse("ef"), ResultKind.SoftFail);
        });
        it("fails hard when 1st fails hard", () => {
            let parser2 = fail({
                reason: "fail",
                kind: ResultKind.HardFail
            }).pipe(
                mapConst("x"),
                or("ab")
            );
            expectFailure(parser2.parse("ab"), ResultKind.HardFail);
        });
        let parser2 = string("ab").pipe(
            or(fail({
                reason: "x",
                kind: "Hard"
            }))
        );
        it("succeeds with 2nd would've failed hard", () => {
            expectSuccess(parser2.parse("ab"), "ab");
        });
        it("fails when 2nd fails hard", () => {
            expectFailure(parser2.parse("cd"), ResultKind.HardFail);
        });
    });
});

describe("or val combinator", () => {
    let parser = string("a").pipe(
        then("b"),
        stringify(),
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
        expectFailure(parser.parse("ax"), ResultKind.HardFail);
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
        stringify(),
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
        expectFailure(parser.parse("ab"), ResultKind.SoftFail);
    });
    it("fails fatally on fatal fail", () => {
        let parser2 = fail({
            kind: "Fatal",
            reason: "fatal"
        }).pipe(
            not()
        );
        expectFailure(parser2.parse(""), ResultKind.FatalFail);
    });
    it("fails on too much input", () => {
        expectFailure(parser.parse("a"), ResultKind.SoftFail);
    });
});

describe("soft combinator", () => {
    let parser = string("a").pipe(
        then("b"),
        stringify(),
        soft()
    );
    it("succeeds", () => {
        expectSuccess(parser.parse("ab"), "ab");
    });
    it("fails softly on soft fail", () => {
        expectFailure(parser.parse("ba"), ResultKind.SoftFail);
    });
    it("fails softly on hard fail", () => {
        expectFailure(parser.parse("a"), ResultKind.SoftFail);
    });
    it("fails fatally on fatal fail", () => {
        let parser2 = fail({
            kind: "Fatal"
        }).pipe(
            soft()
        );
        expectFailure(parser2.parse(""), ResultKind.FatalFail);
    });
});
