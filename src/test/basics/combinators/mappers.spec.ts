/**
 * Created by lifeg on 10/12/2016.
 */
import {expectFailure, expectSuccess} from "../../helpers/custom-matchers";
import {Parjs} from "../../../lib";
import {ReplyKind} from "../../../lib/reply";

let goodInput = "abcd";
let badInput = "";
let uState = {};
let loudParser = Parjs.stringLen(4);

describe("map combinators", () => {
    describe("map", () => {
        let parser = loudParser.map(x => 1);
        it("maps on success", () => {
            expectSuccess(parser.parse(goodInput, uState), 1);
        });
        it("fails on failure", () => {
            expectFailure(parser.parse(badInput, uState), ReplyKind.SoftFail);
        });
    });

    describe("Parjs.result(1)", () => {
        let parser = loudParser.result(1);
        it("maps on success", () => {
            expectSuccess(parser.parse(goodInput), 1);
        });
        it("fails on failure", () => {
            expectFailure(parser.parse(badInput));
        });
    });

    describe("cast", () => {
        let parser = loudParser.cast<number>();
        it("maps on success", () => {
            expectSuccess(parser.parse(goodInput), "abcd" as any);
        });
        it("fails on failure", () => {
            expectFailure(parser.parse(badInput));
        });
    });

    describe("quiet", () => {
        let parser = loudParser.q;
        it("is quiet", () => {
            expect(parser.isLoud).toBe(false);
        });

        it("maps to undefined on success", () => {
            expectSuccess(parser.parse(goodInput), undefined);
        });

        it("fails on failure", () => {
            expectFailure(parser.parse(badInput));
        });
    });

    describe("str", () => {
        it("quiet", () => {
            let p = Parjs.eof.str;
            expectSuccess(p.parse(""), "");
        });

        it("array", () => {
            let p = Parjs.result(["a", "b", "c"]).str;
            expectSuccess(p.parse(""), "abc");
        });

        it("nested array", () => {
            let p = Parjs.result(["a", ["b", ["c"], "d"], "e"]).str;
            expectSuccess(p.parse(""), "abcde");
        });

        it("null", () => {
            let p = Parjs.result(null).str;
            expectSuccess(p.parse(""), "null");
        });

        it("undefined", () => {
            let p = Parjs.result(undefined).str;
            expectSuccess(p.parse(""), "undefined");
        });

        it("string", () => {
            let p = Parjs.string("a").str;
            expectSuccess(p.parse("a"), "a");
        });


        it("object", () => {
            let p = Parjs.result({}).str;
            expectSuccess(p.parse(""), {}.toString());
        });
    });

    describe("each", () => {
        let tally = "";
        let p = Parjs.anyCharOf("abc").each((result, state) => {
            tally += result;
            state.char = result;
        });
        it("works", () => {
            expectSuccess(p.parse("a"), "a");
            expect(tally).toBe("a");
            expectSuccess(p.parse("b"), "b");
            expect(tally).toBe("ab");
            expectFailure(p.parse("d"), "Soft");
            expect(tally).toBe("ab");
        });
    });
});
