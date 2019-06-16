/**
 * Created by lifeg on 09/12/2016.
 */
import {expectFailure, expectSuccess} from "../../helpers/custom-matchers";
import {ResultKind} from "../../../lib/internal/reply";
import {
    anyChar,
    anyCharOf,
    anyStringOf, charCodeWhere, charWhere,
    newline,
    noCharOf, regexp, rest,
    string, stringLen,
    uniNewline
} from "../../../lib/internal/parsers";
import {letter, lower, spaces1, upper} from "../../../lib/internal/parsers/char-types";
import {many, then} from "../../../lib/combinators";
import _ = require("lodash");


let uState = {};

describe("basic string parsers", () => {

    describe("anyChar", () => {
        let parser = anyChar();
        let successInput = "a";
        let failInput = "";
        let tooLongInput = "ab";
        it("succeeds on single char", () => {
            expectSuccess(parser.parse(successInput, uState), successInput);
        });
        it("fails on empty input", () => {
            expectFailure(parser.parse(failInput, uState), ResultKind.SoftFail);
        });
        it("fails on too long input", () => {
            expectFailure(parser.parse(tooLongInput, uState), ResultKind.SoftFail);
        });
    });

    describe("spaces1", () => {
        let parser = spaces1();
        it("fails on empty input", () => {
            expectFailure(parser.parse(""), "Soft");
        });
        it("fails on other char", () => {
            expectFailure(parser.parse("a"), "Soft");
        });
        it("succeeds on single space", () => {
            expectSuccess(parser.parse(" "), " ");
        });
        it("succeeds on multiple spaces", () => {
            expectSuccess(parser.parse(_.repeat(" ", 5)), _.repeat(" ", 5));
        });
    });

    describe("upper", () => {
        let parser = upper();
        it("fails on empty input", () => {
            expectFailure(parser.parse(""), "Soft");
        });
        it("fails on other char", () => {
            expectFailure(parser.parse(","), "Soft");
        });
        it("succeeds on char", () => {
            expectSuccess(parser.parse("A"), "A");
        });
    });

    describe("lower", () => {
        let parser = lower();
        it("fails on empty input", () => {
            expectFailure(parser.parse(""), "Soft");
        });
        it("fails on other char", () => {
            expectFailure(parser.parse(","), "Soft");
        });
        it("succeeds on char", () => {
            expectSuccess(parser.parse("a"), "a");
        });
    });

    describe("letter", () => {
        let parser = letter();
        it("fails on empty input", () => {
            expectFailure(parser.parse(""), "Soft");
        });
        it("fails on other char", () => {
            expectFailure(parser.parse(","), "Soft");
        });
        it("succeeds on char", () => {
            expectSuccess(parser.parse("a"), "a");
        });
    });

    describe("anyCharOf[abcd]", () => {
        let parser = anyCharOf("abcd");
        let success = "c";
        let fail = "1";
        it("succeeds on single char from success", () => {
            expectSuccess(parser.parse(success), success);
        });
        it("fails on invalid single char", () => {
            expectFailure(parser.parse(fail), ResultKind.SoftFail);
        });
        it("fails on too long input", () => {
            expectFailure(parser.parse("ab"), ResultKind.SoftFail);
        });
        it("fails on empty input", () => {
            expectFailure(parser.parse(""), "Soft");
        });
    });

    describe("noCharOf[abcd]", () => {
        let parser = noCharOf("abcd");
        let success = "1";
        let fail = "a";
        it("success on single char not from list", () => {
            expectSuccess(parser.parse(success), success);
        });
        it("fails on single char from list", () => {
            expectFailure(parser.parse(fail), ResultKind.SoftFail);
        });
        it("fails on too long input", () => {
            expectFailure(parser.parse("12"), ResultKind.SoftFail);
        });
    });


    describe("string(hi)", () => {
        let parser = string("hi");
        let success = "hi";
        let fail = "bo";
        it("success", () => {
            expectSuccess(parser.parse(success), success);
        });
        it("fail", () => {
            expectFailure(parser.parse(fail), ResultKind.SoftFail);
        });
        it("fail too long", () => {
            expectFailure(parser.parse(`${success}1`), ResultKind.SoftFail);
        });
    });

    describe("anyStringOf(hi, hello)", () => {
        let parser = anyStringOf("hi", "hello");
        let success1 = "hello";
        let success2 = "hi";
        let fail = "bo";
        it("success1", () => {
            expectSuccess(parser.parse(success1), success1);
        });
        it("success2", () => {
            expectSuccess(parser.parse(success2), success2);
        });
        it("fail", () => {
            expectFailure(parser.parse(fail), ResultKind.SoftFail);
        });
        it("fail too long", () => {
            expectFailure(parser.parse(`${success2}1`), ResultKind.SoftFail);
        });
    });

    describe("newline", () => {
        let parser = newline();
        let unix = "\n";
        let winNewline = "\r\n";
        let macNewline = "\r";
        let badInput = "a";
        let empty = "";
        let tooLong1 = "\r\n1";
        let tooLong2 = "\n\r";
        let allNewlines = "\r\r\n\n\u0085\u2028\u2029";

        it("success unix newline", () => {
            expectSuccess(parser.parse(unix), unix);
        });
        it("success windows newline", () => {
            expectSuccess(parser.parse(winNewline), winNewline);
        });
        it("success on mac newline", () => {
            expectSuccess(parser.parse(macNewline), macNewline);
        });

        it("success on all newline string, incl unicode newline", () => {
            let unicodeNewline = uniNewline().pipe(
                many()
            );
            let result = unicodeNewline.parse(allNewlines);
            expect(result.kind).toBe(ResultKind.Ok);
            if (result.kind !== ResultKind.Ok) return;
            expect(result.value.length).toBe(allNewlines.length - 1);
        });

        it("fails on empty", () => {
            expectFailure(parser.parse(empty));
        });
        it("fails on bad", () => {
            expectFailure(parser.parse(badInput));
        });
        it("fails on too long 1", () => {
            expectFailure(parser.parse(tooLong1));
        });
        it("fails on too long 2", () => {
            expectFailure(parser.parse(tooLong2));
        });
    });

    describe("rest", () => {
        let parser = rest();
        let nonEmpty = "abcd";
        let empty = "";
        it("success on non-empty let input", () => {
            expectSuccess(parser.parse(nonEmpty));
        });
        it("success on empty input", () => {
            expectSuccess(parser.parse(empty));
        });
    });

    describe("stringLen(3)", () => {
        let parser = stringLen(3);
        let shortInput = "a";
        let goodInput = "abc";
        let longInput = "abcd";
        it("fails on too short input", () => {
            expectFailure(parser.parse(shortInput));
        });
        it("succeeds on good input", () => {
            expectSuccess(parser.parse(goodInput), goodInput);
        });
        it("fails on long input", () => {
            expectFailure(parser.parse(longInput));
        });
    });

    describe("regexp", () => {
        describe("simple regexp", () => {
            let parser = regexp(/abc/);
            it("succeeds on input", () => {
                expectSuccess(parser.parse("abc"), ["abc"]);
            });
            it("succeds using implicit", () => {
                expectSuccess(string("abc").pipe(then(/abc/)).parse("abcabc"), ["abc", ["abc"]]);
            });
            it("fails on bad input", () => {
                expectFailure(parser.parse("ab"), "Soft");
            });
            it("match starts in the proper location", () => {
                let p = string("abc");
                expectSuccess(p.pipe(then(parser)).parse("abcabc"), ["abc", ["abc"]]);
            });
            it("match ends in the proper location", () => {
                let p1 = string("abc");
                let p2 = regexp(/.{3}/);
                let p3 = string("eeee");
                let r = p1.pipe(
                    then(p2, p3)
                );
                expectSuccess(r.parse("abcabceeee"), ["abc", ["abc"], "eeee"]);
            });
        });

        describe("multi-match regexp", () => {
            let parser = regexp(/(ab)(c)/);
            it("succeeds on input", () => {
                expectSuccess(parser.parse("abc"), ["abc", "ab", "c"]);
            });
            let parser2 = parser.pipe(
                then("de")
            );
            it("chains correctly", () => {
                expectSuccess(parser2.parse("abcde"));
            });
        });

        describe("charWhere", () => {
            let parser = charWhere(x => x === "a");

            it("succeeds when true", () => {
                expectSuccess(parser.parse("a"), "a");
            });

            it("fails when false", () => {
                expectFailure(parser.parse("b"), "Soft");
            });
        });

        describe("charCodeWhere", () => {
            let parser = charCodeWhere(x => x === "a".charCodeAt(0));

            it("succeeds when true", () => {
                expectSuccess(parser.parse("a"), "a");
            });

            it("fails when false", () => {
                expectFailure(parser.parse("b"), "Soft");
            });
        });
    });
});
