/**
 * Created by lifeg on 10/12/2016.
 */
import {expectFailure, expectSuccess} from "../../helpers/custom-matchers";
import {ResultKind} from "../../../lib/internal/reply";
import {ParjserBase, string} from "../../../lib/internal";
import {anyCharOf, eof, result, stringLen} from "../../../lib";
import {cast, each, map, str} from "../../../lib/combinators";

let goodInput = "abcd";
let badInput = "";
let uState = {};
let loudParser = stringLen(4);

describe("map combinators", () => {
    describe("map", () => {
        let parser = loudParser.pipe(
            map(x => 1)
        );
        it("maps on success", () => {
            expectSuccess(parser.parse(goodInput, uState), 1);
        });
        it("fails on failure", () => {
            expectFailure(parser.parse(badInput, uState), ResultKind.SoftFail);
        });
    });

    describe("cast", () => {
        let parser = loudParser.pipe(
            cast(x => x as unknown as number)
        );
        it("maps on success", () => {
            expectSuccess(parser.parse(goodInput), "abcd" as any);
        });
        it("fails on failure", () => {
            expectFailure(parser.parse(badInput));
        });
    });

    describe("str", () => {
        it("quiet", () => {
            let p = eof().pipe(
                map(x => "")
            );
            expectSuccess(p.parse(""), "");
        });

        it("array", () => {
            let p = result(["a", "b", "c"]).pipe(
                str()
            );
            expectSuccess(p.parse(""), "abc");
        });

        it("nested array", () => {
            let p = result(["a", ["b", ["c"], "d"], "e"]).pipe(
                str()
            );
            expectSuccess(p.parse(""), "abcde");
        });

        it("null", () => {
            let p = result(null).pipe(
                str()
            );
            expectSuccess(p.parse(""), "null");
        });

        it("undefined", () => {
            let p = result(undefined).pipe(
                str()
            );
            expectSuccess(p.parse(""), "undefined");
        });

        it("string", () => {
            let p = string("a").pipe(
                str()
            );
            expectSuccess(p.parse("a"), "a");
        });


        it("object", () => {
            let p = result({}).pipe(
                str()
            );
            expectSuccess(p.parse(""), {}.toString());
        });
    });

    describe("each", () => {
        let tally = "";
        let p = anyCharOf("abc").pipe(
            each((result, state) => {
                tally += result;
                state.char = result;
            })
        );
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
