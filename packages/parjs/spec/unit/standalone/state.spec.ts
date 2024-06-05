import { state } from "@lib";

describe("state", () => {
    const parser = state();
    const uState = { tag: 1 };
    const someInput = "abcd";
    it("fails on non-empty input", () => {
        const parseResult = parser.parse(someInput, uState);
        expect(parseResult).toBeFailure();
    });
});
