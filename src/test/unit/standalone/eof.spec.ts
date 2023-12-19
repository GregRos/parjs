import { then } from "../../../lib/combinators";
import { eof } from "../../../lib/internal/parsers";
import { ResultKind } from "../../../lib/internal/result";

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
        const parser2 = parser.pipe(then(eof()));
        expect(parser2.parse("")).toBeSuccessful(undefined);
    });
});
