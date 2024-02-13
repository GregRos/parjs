import { string } from "../../../lib";
import { thenq } from "../../../lib/combinators";

describe("thenq", () => {
    it("succeeds", () => {
        const parser = string("ab").pipe(thenq(string("cd")));
        expect(parser.parse("abcd")).toBeSuccessful("ab");
    });
});
