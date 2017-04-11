"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by lifeg on 09/12/2016.
 */
const custom_matchers_1 = require("../../custom-matchers");
const dist_1 = require("../../../dist");
const reply_1 = require("../../../dist/reply");
let uState = {};
describe("basic string parsers", () => {
    describe("Parjs.anyChar", () => {
        let parser = dist_1.Parjs.anyChar;
        let successInput = "a";
        let failInput = "";
        let tooLongInput = "ab";
        it("succeeds on single char", () => {
            custom_matchers_1.expectSuccess(parser.parse(successInput, uState), successInput);
        });
        it("fails on empty input", () => {
            custom_matchers_1.expectFailure(parser.parse(failInput, uState), reply_1.ReplyKind.SoftFail);
        });
        it("fails on too long input", () => {
            custom_matchers_1.expectFailure(parser.parse(tooLongInput, uState), reply_1.ReplyKind.SoftFail);
        });
    });
    describe("Parjs.spaces1", () => {
        let parser = dist_1.Parjs.spaces1;
        it("fails on empty input", () => {
            custom_matchers_1.expectFailure(parser.parse(""), "SoftFail");
        });
        it("fails on other char", () => {
            custom_matchers_1.expectFailure(parser.parse("a"), "SoftFail");
        });
        it("succeeds on single space", () => {
            custom_matchers_1.expectSuccess(parser.parse(" "), " ");
        });
        it("succeeds on multiple spaces", () => {
            custom_matchers_1.expectSuccess(parser.parse(" ".repeat(5)), " ".repeat(5));
        });
    });
    describe("Parjs.asciiUpper", () => {
        let parser = dist_1.Parjs.asciiUpper;
        it("fails on empty input", () => {
            custom_matchers_1.expectFailure(parser.parse(""), "SoftFail");
        });
        it("fails on other char", () => {
            custom_matchers_1.expectFailure(parser.parse(","), "SoftFail");
        });
        it("succeeds on char", () => {
            custom_matchers_1.expectSuccess(parser.parse("A"), "A");
        });
    });
    describe("Parjs.asciiUpper", () => {
        let parser = dist_1.Parjs.asciiLower;
        it("fails on empty input", () => {
            custom_matchers_1.expectFailure(parser.parse(""), "SoftFail");
        });
        it("fails on other char", () => {
            custom_matchers_1.expectFailure(parser.parse(","), "SoftFail");
        });
        it("succeeds on char", () => {
            custom_matchers_1.expectSuccess(parser.parse("a"), "a");
        });
    });
    describe("Parjs.asciiLetter", () => {
        let parser = dist_1.Parjs.asciiLower;
        it("fails on empty input", () => {
            custom_matchers_1.expectFailure(parser.parse(""), "SoftFail");
        });
        it("fails on other char", () => {
            custom_matchers_1.expectFailure(parser.parse(","), "SoftFail");
        });
        it("succeeds on char", () => {
            custom_matchers_1.expectSuccess(parser.parse("a"), "a");
        });
    });
    describe("Parjs.anyCharOf[abcd]", () => {
        let parser = dist_1.Parjs.anyCharOf("abcd");
        let success = "c";
        let fail = "1";
        it("succeeds on single char from success", () => {
            custom_matchers_1.expectSuccess(parser.parse(success), success);
        });
        it("fails on invalid single char", () => {
            custom_matchers_1.expectFailure(parser.parse(fail), reply_1.ReplyKind.SoftFail);
        });
        it("fails on too long input", () => {
            custom_matchers_1.expectFailure(parser.parse("ab"), reply_1.ReplyKind.SoftFail);
        });
        it("fails on empty input", () => {
            custom_matchers_1.expectFailure(parser.parse(""), "SoftFail");
        });
    });
    describe("Parjs.noCharOf[abcd]", () => {
        let parser = dist_1.Parjs.noCharOf("abcd");
        let success = "1";
        let fail = "a";
        it("success on single char not from list", () => {
            custom_matchers_1.expectSuccess(parser.parse(success), success);
        });
        it("fails on single char from list", () => {
            custom_matchers_1.expectFailure(parser.parse(fail), reply_1.ReplyKind.SoftFail);
        });
        it("fails on too long input", () => {
            custom_matchers_1.expectFailure(parser.parse("12"), reply_1.ReplyKind.SoftFail);
        });
    });
    describe("Parjs.string(hi)", () => {
        let parser = dist_1.Parjs.string("hi");
        let success = "hi";
        let fail = "bo";
        it("success", () => {
            custom_matchers_1.expectSuccess(parser.parse(success), success);
        });
        it("fail", () => {
            custom_matchers_1.expectFailure(parser.parse(fail), reply_1.ReplyKind.SoftFail);
        });
        it("fail too long", () => {
            custom_matchers_1.expectFailure(parser.parse(success + "1"), reply_1.ReplyKind.SoftFail);
        });
    });
    describe("Parjs.anyStringOf(hi, hello)", () => {
        let parser = dist_1.Parjs.anyStringOf("hi", "hello");
        let success1 = "hello";
        let success2 = "hi";
        let fail = "bo";
        it("success1", () => {
            custom_matchers_1.expectSuccess(parser.parse(success1), success1);
        });
        it("success2", () => {
            custom_matchers_1.expectSuccess(parser.parse(success2), success2);
        });
        it("fail", () => {
            custom_matchers_1.expectFailure(parser.parse(fail), reply_1.ReplyKind.SoftFail);
        });
        it("fail too long", () => {
            custom_matchers_1.expectFailure(parser.parse(success2 + "1"), reply_1.ReplyKind.SoftFail);
        });
    });
    describe("Parjs.newline", () => {
        let parser = dist_1.Parjs.newline;
        let unix = "\n";
        let winNewline = "\r\n";
        let macNewline = "\r";
        let badInput = "a";
        let empty = "";
        let tooLong1 = "\r\n1";
        let tooLong2 = "\n\r";
        let allNewlines = "\r\r\n\n\u0085\u2028\u2029";
        it("success unix newline", () => {
            custom_matchers_1.expectSuccess(parser.parse(unix), unix);
        });
        it("success windows newline", () => {
            custom_matchers_1.expectSuccess(parser.parse(winNewline), winNewline);
        });
        it("success on mac newline", () => {
            custom_matchers_1.expectSuccess(parser.parse(macNewline), macNewline);
        });
        it("success on all newline string, incl unicode newline", () => {
            let unicodeNewline = dist_1.Parjs.unicodeNewline.many();
            let result = unicodeNewline.parse(allNewlines);
            expect(result.kind).toBe(reply_1.ReplyKind.OK);
            if (result.kind !== reply_1.ReplyKind.OK)
                return;
            expect(result.value.length).toBe(allNewlines.length - 1);
        });
        it("fails on empty", () => {
            custom_matchers_1.expectFailure(parser.parse(empty));
        });
        it("fails on bad", () => {
            custom_matchers_1.expectFailure(parser.parse(badInput));
        });
        it("fails on too long 1", () => {
            custom_matchers_1.expectFailure(parser.parse(tooLong1));
        });
        it("fails on too long 2", () => {
            custom_matchers_1.expectFailure(parser.parse(tooLong2));
        });
    });
    describe("Parjs.rest", () => {
        let parser = dist_1.Parjs.rest;
        let nonEmpty = "abcd";
        let empty = "";
        it("success on non-empty let input", () => {
            custom_matchers_1.expectSuccess(parser.parse(nonEmpty));
        });
        it("success on empty input", () => {
            custom_matchers_1.expectSuccess(parser.parse(empty));
        });
    });
    describe("Parjs.stringLen(3)", () => {
        let parser = dist_1.Parjs.stringLen(3);
        let shortInput = "a";
        let goodInput = "abc";
        let longInput = "abcd";
        it("fails on too short input", () => {
            custom_matchers_1.expectFailure(parser.parse(shortInput));
        });
        it("succeeds on good input", () => {
            custom_matchers_1.expectSuccess(parser.parse(goodInput), goodInput);
        });
        it("fails on long input", () => {
            custom_matchers_1.expectFailure(parser.parse(longInput));
        });
    });
    describe("Parjs.regexp", () => {
        describe("simple regexp", () => {
            let parser = dist_1.Parjs.regexp(/abc/);
            it("succeeds on input", () => {
                custom_matchers_1.expectSuccess(parser.parse("abc"), ["abc"]);
            });
            it("fails on bad input", () => {
                custom_matchers_1.expectFailure(parser.parse("ab"), "SoftFail");
            });
        });
        describe("multi-match regexp", () => {
            let parser = dist_1.Parjs.regexp(/(ab)(c)/);
            it("succeeds on input", () => {
                custom_matchers_1.expectSuccess(parser.parse("abc"), ["abc", "ab", "c"]);
            });
            let parser2 = parser.then(dist_1.Parjs.string("de"));
            it("chains correctly", () => {
                custom_matchers_1.expectSuccess(parser2.parse("abcde"));
            });
        });
    });
});
//# sourceMappingURL=string.spec.js.map