import { qthen } from "../../../lib/combinators";
import { string } from "../../../lib";

describe("qthen", () => {
    it("succeeds", () => {
        const parser = string("ab").pipe(qthen(string("cd")));
        expect(parser.parse("abcd")).toBeSuccessful("cd");
    });
});
