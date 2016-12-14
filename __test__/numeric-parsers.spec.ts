import {Parjs} from "../src/bindings/parsers";
import {verifyFailure, verifySuccess} from "./custom-matchers";
import {ResultKind} from "../src/abstract/basics/result";
/**
 * Created by User on 14-Dec-16.
 */

describe("numeric parsers", () => {
    describe("int parser", () => {
        let parser = Parjs.int({
            base : 10,
            allowSign : true
        });
        describe("default settings", () => {
            it("fails for empty input", () => {
                verifyFailure(parser.parse(""), ResultKind.SoftFail);
            });
            it("fails for bad digits", () => {
                verifyFailure(parser.parse("a"), ResultKind.SoftFail);
            });
            it("succeeds for sequence of with sign digits", () => {
                verifySuccess(parser.parse("-22"), 22);
            });
            it("succeeds for sequence of digits without sign", () => {
                verifySuccess(parser.parse("22"), 22);
            });
            it("fails for extra letters", () => {
                verifyFailure(parser.parse("22a"), ResultKind.SoftFail);
            });
            it("chains into rest", () => {
                verifySuccess(parser.then(Parjs.rest.quiet).parse("22a"), 22);
            });
            it("fails hard if there are no digits after sign", () => {
                verifyFailure(parser.parse("+a"), ResultKind.HardFail);
            })

        });
        describe("no sign", () => {

        })
    });
});