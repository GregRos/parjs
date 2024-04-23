import { surrounded } from "../../examples/tuple";

describe("the tuple example", () => {
    describe("a complex example", () => {
        const successInput = "(1,  2 , 3 )";

        const parser = surrounded;

        it("can parse the example", () => {
            const result = parser.parse(successInput);
            expect(result).toBeSuccessful();
        });
    });
});
