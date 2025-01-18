import { ResultKind, eof } from "@lib";
import { thenceforth } from "@lib/combinators";

describe("eof", () => {
    const parser = eof();
    const failInput = "a";
    const successInput = "";
    it("success on empty input", () => {
        expect(parser.parse(successInput)).toBeSuccessful(undefined);
    });
    it("fail on non-empty input", () => {
        expect(parser.parse(failInput)).toBeFailure(ResultKind.SoftFail);
    });
    it("chain multiple EOF succeeds", () => {
        const parser2 = parser.pipe(thenceforth(eof()));
        expect(parser2.parse("")).toBeSuccessful(undefined);
    });
});
