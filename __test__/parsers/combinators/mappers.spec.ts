/**
 * Created by lifeg on 10/12/2016.
 */
import {verifyFailure, verifySuccess} from '../../custom-matchers';
import {LoudParser} from "../../../src/abstract/combinators/loud";
import {Parjs} from "../../../src/bindings/parsers";
import {ResultKind} from "../../../src/abstract/basics/result";
import {AnyParser} from "../../../src/abstract/combinators/any";

let goodInput = "abcd";
let badInput = "";
let uState = {};
let loudParser = Parjs.stringLen(4);



function forParser<TParser extends AnyParser>(parser : TParser, f : (action : TParser) => void) {
    describe(`Parjs.${parser.displayName}`, () => {
        f(parser);
    });
}

describe("map combinators", () => {
    forParser(loudParser.map(x => 1), parser => {
        it("maps on success", () => {
            verifySuccess(parser.parse(goodInput, uState), 1, uState);
        });
        it("fails on failure", () => {
            verifyFailure(parser.parse(badInput, uState), ResultKind.SoftFail, uState);
        });
    });

    forParser(loudParser.result(1), parser => {
        it("maps on success", () => {
            verifySuccess(parser.parse(goodInput, uState), 1);
        });
        it("fails on failure", () => {
            verifyFailure(parser.parse(badInput, uState));
        })
    });

    forParser(loudParser.cast<number>(), parser => {
        it("maps on success", () => {
            verifySuccess(parser.parse(goodInput), "abcd");
        });
        it("fails on failure", () => {
            verifyFailure(parser.parse(badInput));
        })
    });

    forParser(loudParser.quiet, parser => {
        it("is quiet", () => {
            expect(parser.isLoud).toBe(false);
        });

        it("maps to undefined on success", () => {
           verifySuccess(parser.parse(goodInput), undefined);
        });

        it("fails on failure", () => {
            verifyFailure(parser.parse(badInput));
        });

        it("does not support loud combinators, like .map", () => {
            expect(() => (parser as any).map(x => 1)).toThrow();
        });
    });
});
