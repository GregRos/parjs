import { expectFailure, expectSuccess } from "../../helpers/custom-matchers";
import { ResultKind } from "../../../lib/internal/result";
import {
    anyChar,
    anyCharOf,
    anyStringOf,
    charCodeWhere,
    charWhere,
    newline,
    noCharOf,
    regexp,
    rest,
    string,
    stringLen
} from "../../../lib/internal/parsers";
import { letter, lower, spaces1, upper } from "../../../lib/internal/parsers/char-types";
import { then } from "../../../lib/combinators";
import _ = require("lodash");

const uState = {};

describe("basic string parsers", () => {
    describe("anyChar", () => {
        const parser = anyChar();
        const successInput = "a";
        const failInput = "";
        const tooLongInput = "ab";
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
        const parser = spaces1();
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
        const parser = upper();
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
        const parser = lower();
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
        const parser = letter();
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
        const parser = anyCharOf("abcd");
        const success = "c";
        const fail = "1";
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
        const parser = noCharOf("abcd");
        const success = "1";
        const fail = "a";
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
        const parser = string("hi");
        const success = "hi";
        const fail = "bo";
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
        const parser = anyStringOf("hi", "hello");
        const success1 = "hello";
        const success2 = "hi";
        const fail = "bo";
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
        const parser = newline();
        const unix = "\n";
        const winNewline = "\r\n";
        const macNewline = "\r";
        const badInput = "a";
        const empty = "";
        const tooLong1 = "\r\n1";
        const tooLong2 = "\n\r";

        it("success unix newline", () => {
            expectSuccess(parser.parse(unix), unix);
        });
        it("success windows newline", () => {
            expectSuccess(parser.parse(winNewline), winNewline);
        });
        it("success on mac newline", () => {
            expectSuccess(parser.parse(macNewline), macNewline);
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
        const parser = rest();
        const nonEmpty = "abcd";
        const empty = "";
        it("success on non-empty let input", () => {
            expectSuccess(parser.parse(nonEmpty));
        });
        it("success on empty input", () => {
            expectSuccess(parser.parse(empty));
        });
    });

    describe("stringLen(3)", () => {
        const parser = stringLen(3);
        const shortInput = "a";
        const goodInput = "abc";
        const longInput = "abcd";
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
            const parser = regexp(/abc/);
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
                const p = string("abc");
                expectSuccess(p.pipe(then(parser)).parse("abcabc"), ["abc", ["abc"]]);
            });
            it("match ends in the proper location", () => {
                const p1 = string("abc");
                const p2 = regexp(/.{3}/);
                const p3 = string("eeee");
                const r = p1.pipe(then(p2, p3));
                expectSuccess(r.parse("abcabceeee"), ["abc", ["abc"], "eeee"]);
            });
        });

        describe("multi-match regexp", () => {
            const parser = regexp(/(ab)(c)/);
            it("succeeds on input", () => {
                expectSuccess(parser.parse("abc"), ["abc", "ab", "c"]);
            });
            const parser2 = parser.pipe(then("de"));
            it("chains correctly", () => {
                expectSuccess(parser2.parse("abcde"));
            });
        });

        describe("charWhere", () => {
            const parser = charWhere(x => x === "a" || {});

            it("succeeds when true", () => {
                expectSuccess(parser.parse("a"), "a");
            });

            it("fails when false", () => {
                expectFailure(parser.parse("b"), "Soft");
            });
        });

        describe("charCodeWhere", () => {
            const parser = charCodeWhere(x => x === "a".charCodeAt(0) || {});

            it("succeeds when true", () => {
                expectSuccess(parser.parse("a"), "a");
            });

            it("fails when false", () => {
                expectFailure(parser.parse("b"), "Soft");
            });
        });
    });
});
