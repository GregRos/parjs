import { exampleInput, pJsonValue } from "../src/json";

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

    it("can parse the example input", () => {
        const result = pJsonValue.parse(exampleInput);
        expect(result).toMatchInlineSnapshot(`
            ParjsSuccess {
              "kind": "OK",
              "value": JsonObject {
                "value": [
                  JsonObjectProperty {
                    "name": "a",
                    "value": JsonNumber {
                      "value": 2,
                    },
                  },
                  JsonObjectProperty {
                    "name": "b"",
                    "value": JsonNumber {
                      "value": 44325,
                    },
                  },
                  JsonObjectProperty {
                    "name": "z",
                    "value": JsonString {
                      "value": "hi!",
                    },
                  },
                  JsonObjectProperty {
                    "name": "a",
                    "value": JsonBool {
                      "value": true,
                    },
                  },
                  JsonObjectProperty {
                    "name": "array",
                    "value": JsonArray {
                      "value": [
                        JsonString {
                          "value": "hi",
                        },
                        JsonNumber {
                          "value": 1,
                        },
                        JsonObject {
                          "value": [
                            JsonObjectProperty {
                              "name": "a",
                              "value": JsonString {
                                "value": "b"",
                              },
                            },
                          ],
                        },
                        JsonArray {
                          "value": [],
                        },
                        JsonObject {
                          "value": [],
                        },
                      ],
                    },
                  },
                ],
              },
            }
        `);
    });
});
