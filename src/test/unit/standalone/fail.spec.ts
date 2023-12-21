import { fail } from "../../../lib/internal/parsers";
import { ResultKind } from "../../../lib/internal/result";

describe("fail", () => {
    const parser = fail({
        kind: "Fatal"
    });
    const noInput = "";
    const input = "abc";
    it("fails on no input", () => {
        expect(parser.parse(noInput)).toBeFailure(ResultKind.FatalFail);
    });
    it("fails on non-empty input", () => {
        expect(parser.parse(input)).toBeFailure(ResultKind.FatalFail);
    });
});
