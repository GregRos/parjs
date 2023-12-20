import _ from "lodash";
import type { ParjsResult, Parjser } from "../../../lib";
import { then } from "../../../lib/combinators";
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
import {
    letter,
    lower,
    space,
    spaces1,
    upper,
    whitespace
} from "../../../lib/internal/parsers/char-types";
import { ResultKind } from "../../../lib/internal/result";

const uState = {};

describe("basic string parsers", () => {
    describe("anyChar", () => {
        const parser = anyChar();
        const successInput = "a";
        const failInput = "";
        const tooLongInput = "ab";
        it("succeeds on single char", () => {
            expect(parser.parse(successInput, uState)).toBeSuccessful(successInput);
        });
        it("fails on empty input", () => {
            expect(parser.parse(failInput, uState)).toBeFailure(ResultKind.SoftFail);
        });
        it("fails on too long input", () => {
            expect(parser.parse(tooLongInput, uState)).toBeFailure(ResultKind.SoftFail);
        });
    });

    describe("space", () => {
        it("can parse a space", () => {
            expect(space().parse(" ")).toBeSuccessful(" ");
        });

        it("can parse a tab", () => {
            expect(space().parse("\t")).toBeSuccessful("\t");
        });
    });

    describe("whitespace", () => {
        it("can parse a space", () => {
            expect(whitespace().parse(" ")).toBeSuccessful(" ");
        });

        it("can parse a tab", () => {
            expect(whitespace().parse("\t")).toBeSuccessful("\t");
        });

        it("can parse a newline", () => {
            expect(whitespace().parse("\n")).toBeSuccessful("\n");
        });
    });

    describe("spaces1", () => {
        const parser = spaces1();
        it("fails on empty input", () => {
            expect(parser.parse("")).toBeFailure("Soft");
        });
        it("fails on other char", () => {
            expect(parser.parse("a")).toBeFailure("Soft");
        });
        it("succeeds on single space", () => {
            expect(parser.parse(" ")).toBeSuccessful(" ");
        });
        it("succeeds on multiple spaces", () => {
            expect(parser.parse(_.repeat(" ", 5))).toBeSuccessful(_.repeat(" ", 5));
        });
    });

    describe("upper", () => {
        const parser = upper();
        it("fails on empty input", () => {
            expect(parser.parse("")).toBeFailure("Soft");
        });
        it("fails on other char", () => {
            expect(parser.parse(",")).toBeFailure("Soft");
        });
        it("succeeds on char", () => {
            expect(parser.parse("A")).toBeSuccessful("A");
        });
    });

    describe("lower", () => {
        const parser = lower();
        it("fails on empty input", () => {
            expect(parser.parse("")).toBeFailure("Soft");
        });
        it("fails on other char", () => {
            expect(parser.parse(",")).toBeFailure("Soft");
        });
        it("succeeds on char", () => {
            expect(parser.parse("a")).toBeSuccessful("a");
        });
    });

    describe("letter", () => {
        const parser = letter();
        it("fails on empty input", () => {
            expect(parser.parse("")).toBeFailure("Soft");
        });
        it("fails on other char", () => {
            expect(parser.parse(",")).toBeFailure("Soft");
        });
        it("succeeds on char", () => {
            expect(parser.parse("a")).toBeSuccessful("a");
        });
    });

    describe("anyCharOf[abcd]", () => {
        const parser = anyCharOf("abcd");
        const success = "c";
        const fail = "1";
        it("succeeds on single char from success", () => {
            expect(parser.parse(success)).toBeSuccessful(success);
        });
        it("fails on invalid single char", () => {
            expect(parser.parse(fail)).toBeFailure(ResultKind.SoftFail);
        });
        it("fails on too long input", () => {
            expect(parser.parse("ab")).toBeFailure(ResultKind.SoftFail);
        });
        it("fails on empty input", () => {
            expect(parser.parse("")).toBeFailure("Soft");
        });
    });

    describe("noCharOf[abcd]", () => {
        const parser = noCharOf("abcd");
        const success = "1";
        const fail = "a";
        it("success on single char not from list", () => {
            expect(parser.parse(success)).toBeSuccessful(success);
        });
        it("fails on single char from list", () => {
            expect(parser.parse(fail)).toBeFailure(ResultKind.SoftFail);
        });
        it("fails on too long input", () => {
            expect(parser.parse("12")).toBeFailure(ResultKind.SoftFail);
        });
    });

    describe("string(hi)", () => {
        const parser = string("hi");
        // when parsing, the return type of the parser is what was parsed, literally
        parser satisfies Parjser<"hi">;

        const success = "hi";
        const fail = "bo";
        it("success", () => {
            expect(parser.parse(success)).toBeSuccessful(success);
        });
        it("fail", () => {
            expect(parser.parse(fail)).toBeFailure(ResultKind.SoftFail);
        });
        it("fail too long", () => {
            expect(parser.parse(`${success}1`)).toBeFailure(ResultKind.SoftFail);
        });
    });

    describe("anyStringOf", () => {
        it("success1", () => {
            expect(anyStringOf("hi", "hello").parse("hello")).toBeSuccessful("hello");
        });
        it("success2", () => {
            expect(anyStringOf("hi", "hello").parse("hi")).toBeSuccessful("hi");
        });
        it("fail", () => {
            expect(anyStringOf("hi", "hello").parse("bo")).toBeFailure(ResultKind.SoftFail);
        });
        it("fail too long", () => {
            expect(anyStringOf("hi", "hello").parse(`hi1`)).toBeFailure(ResultKind.SoftFail);
        });

        it("retains type information when using constant tuples", () => {
            const letters = ["a", "b", "c"] as const;
            letters satisfies readonly ["a", "b", "c"]; // must be a constant tuple

            // type information must be retained in the parser type
            const parser: Parjser<"a" | "c" | "b"> = anyStringOf(...letters);

            // type information must be retained in the result type
            const result: ParjsResult<"a" | "c" | "b"> = parser.parse("a");
            expect(result).toBeSuccessful("a");
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
            expect(parser.parse(unix)).toBeSuccessful(unix);
        });
        it("success windows newline", () => {
            expect(parser.parse(winNewline)).toBeSuccessful(winNewline);
        });
        it("success on mac newline", () => {
            expect(parser.parse(macNewline)).toBeSuccessful(macNewline);
        });

        it("fails on empty", () => {
            expect(parser.parse(empty)).toBeFailure();
        });
        it("fails on bad", () => {
            expect(parser.parse(badInput)).toBeFailure();
        });
        it("fails on too long 1", () => {
            expect(parser.parse(tooLong1)).toBeFailure();
        });
        it("fails on too long 2", () => {
            expect(parser.parse(tooLong2)).toBeFailure();
        });
    });

    describe("rest", () => {
        const parser = rest();
        const nonEmpty = "abcd";
        const empty = "";
        it("success on non-empty let input", () => {
            expect(parser.parse(nonEmpty)).toBeSuccessful();
        });
        it("success on empty input", () => {
            expect(parser.parse(empty)).toBeSuccessful();
        });
    });

    describe("stringLen(3)", () => {
        const parser = stringLen(3);
        const shortInput = "a";
        const goodInput = "abc";
        const longInput = "abcd";
        it("fails on too short input", () => {
            expect(parser.parse(shortInput)).toBeFailure();
        });
        it("succeeds on good input", () => {
            expect(parser.parse(goodInput)).toBeSuccessful(goodInput);
        });
        it("fails on long input", () => {
            expect(parser.parse(longInput)).toBeFailure();
        });
    });

    describe("regexp", () => {
        describe("simple regexp", () => {
            const parser = regexp(/abc/);
            it("succeeds on input", () => {
                expect(parser.parse("abc")).toBeSuccessful(["abc"]);
            });
            it("succeds using implicit", () => {
                expect(string("abc").pipe(then(/abc/)).parse("abcabc")).toBeSuccessful([
                    "abc",
                    ["abc"]
                ]);
            });
            it("fails on bad input", () => {
                expect(parser.parse("ab")).toBeFailure("Soft");
            });
            it("match starts in the proper location", () => {
                const p = string("abc");
                expect(p.pipe(then(parser)).parse("abcabc")).toBeSuccessful(["abc", ["abc"]]);
            });
            it("match ends in the proper location", () => {
                const p1 = string("abc");
                const p2 = regexp(/.{3}/);
                const p3 = string("eeee");
                const r = p1.pipe(then(p2, p3));
                expect(r.parse("abcabceeee")).toBeSuccessful(["abc", ["abc"], "eeee"]);
            });
        });

        describe("multi-match regexp", () => {
            const parser = regexp(/(ab)(c)/);
            it("succeeds on input", () => {
                expect(parser.parse("abc")).toBeSuccessful(["abc", "ab", "c"]);
            });
            const parser2 = parser.pipe(then("de"));
            it("chains correctly", () => {
                expect(parser2.parse("abcde")).toBeSuccessful();
            });
        });

        describe("charWhere", () => {
            const parser = charWhere(x => x === "a" || {});

            it("succeeds when true", () => {
                expect(parser.parse("a")).toBeSuccessful("a");
            });

            it("fails when false", () => {
                expect(parser.parse("b")).toBeFailure("Soft");
            });
        });

        describe("charCodeWhere", () => {
            const parser = charCodeWhere(x => x === "a".charCodeAt(0) || {});

            it("succeeds when true", () => {
                expect(parser.parse("a")).toBeSuccessful("a");
            });

            it("fails when false", () => {
                expect(parser.parse("b")).toBeFailure("Soft");
            });
        });
    });
});
