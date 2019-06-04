/**
 * Created by lifeg on 12/12/2016.
 */
import {expectSuccess} from "../../helpers/custom-matchers";
import {Parjs} from "../../../lib";


describe("overloaded combinators", () => {
    describe("flatten", () => {
        let q = Parjs.string("a");
        it("works with non-array item", () => {
            let p = q.flatten().each(arr => {
                arr.map(x => x.toUpperCase());
            });
            expectSuccess(p.parse("a"), ["a"]);
        });

        it("works with level-1 array", () => {
            let p = q.result(["a", "b"]).flatten().each(arr => {
                arr.map(x => x.toUpperCase());
            });
            expectSuccess(p.parse("a"), ["a", "b"]);
        });

        it("works with level-2 array with nesting", () => {
            let p = q.result([["a"], "b", [], ["c", "d", "e"]] as string[]).flatten().each(arr => {
                arr[0].slice();
                arr.map(x => x.toUpperCase());
            });
            expectSuccess(p.parse("a"), ["a", "b", "c", "d", "e"]);
        });

        it("works with level-2 array with nesting", () => {
            let p = q.result([
                "a",
                [],
                ["b", ["c"]],
                ["d"],
                [[]]
            ]).cast<string[]>().flatten().each(arr => {
                arr.map(x => x.toUpperCase());
            });
            expectSuccess(p.parse("a"), ["a", "b", "c", "d"]);
        });

        it("worked with level-3 array with nesting", () => {
            let p = q.result([
                "a",
                ["b", ["c", ["d"]]],
                [[]],
                [[], "e"],
                [[["f"], "g"]],
                "h"
            ] as string[]).flatten().each(x => {
                x.forEach(x => x.toUpperCase());
            });

            expectSuccess(p.parse("a"), ["a", "b", "c", "d", "e", "f", "g", "h"]);
        });
    });

    describe("splat", () => {
        let a = Parjs.string("a").map(x => ({a: "a"}));

        it("array of two objects", () => {
            let b = a.then([a, Parjs.string("a").result({b: "b"}), Parjs.string("a").result({c: "c"})]).splat();
            b.each(x => {
                x.c.toUpperCase();
                x.b.toUpperCase();
                x.a.toUpperCase();
            });
            expectSuccess(b.parse("aaaa"), {
                a: "a",
                b: "b",
                c: "c"
            });
        });
    });
});