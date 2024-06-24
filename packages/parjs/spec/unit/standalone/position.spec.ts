import { position } from "@lib";

describe("position", () => {
    const parser = position();
    const noInput = "";
    it("succeeds on empty input", () => {
        const parseResult = parser.parse(noInput);
        expect(parseResult).toBeSuccessful(0);
    });
    it("fails on non-empty input", () => {
        const parseResult = parser.parse("abc");
        expect(parseResult).toBeFailure();
    });
});
