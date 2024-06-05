import { anyChar } from "@lib";
import type { ParjserBase } from "@lib/internal";

describe("expects", () => {
    it("is correct", () => {
        const base = anyChar().expects("a character") as ParjserBase<string>;
        const parser = anyChar().expects("a character of some sort") as ParjserBase<string>;
        expect(parser.expecting).toBe("a character of some sort");
        expect(base.expecting).toBe("a character");
    });
});
