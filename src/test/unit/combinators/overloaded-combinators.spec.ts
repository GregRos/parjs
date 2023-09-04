import { expectSuccess } from "../../helpers/custom-matchers";
import { string } from "../../../lib/";
import { each, flatten, map, mapConst } from "../../../lib/combinators";

describe("overloaded combinators", () => {
    describe("flatten", () => {
        const q = string("a");
        it("works with non-array item", () => {
            const p = q.pipe(
                flatten(),
                each(arr => {
                    arr.map(x => x.toUpperCase());
                })
            );
            expectSuccess(p.parse("a"), ["a"]);
        });

        it("works with level-1 array", () => {
            const p = q.pipe(
                map(() => ["a", "b"]),
                flatten(),
                each(arr => {
                    arr.map(x => x.toUpperCase());
                })
            );
            expectSuccess(p.parse("a"), ["a", "b"]);
        });

        it("works with level-2 array with nesting", () => {
            const p = q.pipe(
                map(() => [["a"], "b", [], ["c", "d", "e"]] as string[]),
                flatten(),
                each(arr => {
                    arr[0].slice();
                    arr.map(x => x.toUpperCase());
                })
            );
            expectSuccess(p.parse("a"), ["a", "b", "c", "d", "e"]);
        });

        it("works with level-2 array with nesting", () => {
            const p = q.pipe(
                mapConst(["a", [], ["b", ["c"]], ["d"], [[]]]),
                map(x => x as string[]),
                flatten(),
                each(arr => {
                    arr.map(x => x.toUpperCase());
                })
            );
            expectSuccess(p.parse("a"), ["a", "b", "c", "d"]);
        });

        it("worked with level-3 array with nesting", () => {
            const p = q.pipe(
                mapConst([
                    "a",
                    ["b", ["c", ["d"]]],
                    [[]],
                    [[], "e"],
                    [[["f"], "g"]],
                    "h"
                ] as string[]),
                flatten(),
                each(x => {
                    x.forEach(x => x.toUpperCase());
                })
            );

            expectSuccess(p.parse("a"), ["a", "b", "c", "d", "e", "f", "g", "h"]);
        });
    });
});
