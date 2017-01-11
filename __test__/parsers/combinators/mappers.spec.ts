/**
 * Created by lifeg on 10/12/2016.
 */
import {expectFailure, expectSuccess, expectResult} from '../../custom-matchers';
import {LoudParser} from "../../../src/abstract/combinators/loud";
import {Parjs} from "../../../src/bindings/parsers";
import {ResultKind} from "../../../src/abstract/basics/result";
import {AnyParser} from "../../../src/abstract/combinators/any";

let goodInput = "abcd";
let badInput = "";
let uState = {};
let loudParser = Parjs.stringLen(4);

describe("map combinators", () => {
    describe("map", () => {
        let parser =loudParser.map(x => 1);
        it("maps on success", () => {
            expectSuccess(parser.parse(goodInput, uState), 1, uState);
        });
        it("fails on failure", () => {
            expectFailure(parser.parse(badInput, uState), ResultKind.SoftFail, uState);
        });
    });

    describe("Parjs.result(1)", () => {
        let parser = loudParser.result(1);
        it("maps on success", () => {
            expectSuccess(parser.parse(goodInput, uState), 1);
        });
        it("fails on failure", () => {
            expectFailure(parser.parse(badInput, uState));
        })
    });

    describe("cast", () => {
        let parser = loudParser.cast<number>();
        it("maps on success", () => {
            expectSuccess(parser.parse(goodInput), "abcd" as any);
        });
        it("fails on failure", () => {
            expectFailure(parser.parse(badInput));
        })
    });

    describe("quiet", () => {
        let parser = loudParser.quiet;
        it("is quiet", () => {
            expect(parser.isLoud).toBe(false);
        });

        it("maps to undefined on success", () => {
           expectSuccess(parser.parse(goodInput), undefined);
        });

        it("fails on failure", () => {
            expectFailure(parser.parse(badInput));
        });

        it("does not support loud combinators, like .map", () => {
            expect(() => (parser as any).map(x => 1)).toThrow();
        });
    });

    describe("str", () => {
        it("quiet", () => {
            let p = Parjs.eof.str;
            expectSuccess(p.parse(""), "");
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

        it("symbol", () => {
            let p = Parjs.result(Symbol("hi")).str;
            expectSuccess(p.parse(""), "hi");
        });

        it("object", () => {
            let p = Parjs.result({}).str;
            expectSuccess(p.parse(""), {}.toString());
        })
    })
});
