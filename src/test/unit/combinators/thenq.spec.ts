import { thenq } from "../../../lib/combinators";
import { string } from "../../../lib";

describe("thenq", () => {
    it("succeeds", () => {
        const parser = string("ab").pipe(thenq(string("cd")));
        expect(parser.parse("abcd")).toBeSuccessful("ab");
    });
});
