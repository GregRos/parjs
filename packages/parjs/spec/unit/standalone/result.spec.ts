import { result } from "@lib";

describe("result", () => {
    const parser = result("x");
    const noInput = "";
    it("succeeds on empty input", () => {
        expect(parser.parse(noInput)).toBeSuccessful("x");
    });
    it("fails on non-empty input", () => {
        expect(parser.parse("a")).toBeFailure();
    });
});
