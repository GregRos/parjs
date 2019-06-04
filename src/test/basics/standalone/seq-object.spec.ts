import {AnyParser, Parjs, ReplyKind} from "../../../lib";
import {expectFailure, expectSuccess} from "../../helpers/custom-matchers";

/**
 * Created by lifeg on 16/12/2016.
 */
function forParser<TParser extends AnyParser>(parser: TParser, f: (action: TParser) => void) {
    describe(`Parjs.${parser.displayName}`, () => {
        f(parser);
    });
}

describe("seq object", () => {
    let spec1 = {
        a: Parjs.string("a"),
        b: Parjs.string("b")
    };

    let spec2 = {
        c: Parjs.string("c")
    };

    let spec3 = {
        a: Parjs.string("d"),
        d: Parjs.string("d")
    };
    describe("one", () => {
        let p = Parjs.seqObject(spec1);
        p = p.each(x => {
            x.a.toUpperCase();
            x.b.toUpperCase();
        });
        it("succeeds", () => {
            expectSuccess(p.parse("ab"), {a: "a", b: "b"});
        });
        it("fails", () => {
            expectFailure(p.parse("a"), ReplyKind.HardFail);
            expectFailure(p.parse("x"), ReplyKind.SoftFail);
        });
    });

    describe("two", () => {
        let p = Parjs.seqObject(spec1, spec2);
        p = p.each(x => {
            x.a.toUpperCase();
            x.b.toUpperCase();
            x.c.toUpperCase();
        });
        it("yes", () => {
            expectSuccess(p.parse("abc"), {a: "a", b: "b", c: "c"});
        });
    });

    describe("three", () => {
        let p = Parjs.seqObject(spec1, spec2, spec3);
        it("yes", () => {
            expectSuccess(p.parse("abcdd"), {a: "d", b: "b", c: "c", d: "d"});
        });
    });

});
