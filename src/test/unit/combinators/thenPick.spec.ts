import { thenPick } from "../../../lib/combinators";
import { anyCharOf, string } from "../../../lib/internal/parsers";
import { ResultKind } from "../../../lib/internal/result";

it("thenPick", () => {
    const parser = anyCharOf("ab").pipe(
        thenPick(x => {
            if (x === "a") {
                return string("a");
            } else {
                return string("b");
            }
        })
    );

    expect(parser.parse("aa")).toBeSuccessful("a");
    expect(parser.parse("bb")).toBeSuccessful("b");
    expect(parser.parse("ab")).toBeFailure(ResultKind.HardFail);
});
