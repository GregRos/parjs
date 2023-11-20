import { pJsonValue } from "../../examples/json";

describe("the JSON example", () => {
    describe("a complex example", () => {
        const successInput = `{"a" : 2, 


        "b\\"" : 
        44325, "z" : "hi!", "a" : true,
         "array" : ["hi", 1, {"a" :    "b\\"" }, [], {}]}`;

        const parser = pJsonValue;

        it("can parse a complex example", () => {
            const result = parser.parse(successInput);
            expect(result).toBeSuccessful();
        });
    });
});
