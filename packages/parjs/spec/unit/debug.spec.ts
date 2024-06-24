import type { Parjser } from "@lib";
import { string } from "@lib";

const consoleSpy = jest.spyOn(console, "log").mockImplementation();

describe("the 'debug' method", () => {
    it("should return a parser with the correct type", () => {
        const parser: Parjser<"a"> = string("a").debug();
        expect(parser.type).toBe("string");
    });

    it("should log the correct message", () => {
        const parser: Parjser<"a"> = string("a").expects("an 'a' character").debug();
        parser.parse("a");
        expect(consoleSpy.mock.calls.at(0)?.[0]).toMatchInlineSnapshot(`
            "consumed 'a' (length 1)
            at position 0->1
            👍🏻 (Ok)
            {
              "input": "a",
              "userState": {},
              "position": 1,
              "stack": [],
              "value": "a",
              "kind": "OK"
            }
            {
              "type": "string",
              "expecting": "an 'a' character"
            }"
        `);
    });
});
