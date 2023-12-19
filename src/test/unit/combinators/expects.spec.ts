import { fail, nope } from "../../../lib";
import { reason, then } from "../../../lib/combinators";

describe("expects combinator", () => {
    const base = nope("deez nuts");
    it("sets the expecting", () => {
        const parser = base.pipe(reason("imma let you finish"));

        expect(parser.parse("abc")).toMatchObject({
            kind: "Soft",
            reason: "imma let you finish"
        });
    });
    it("modifies expecting", () => {
        const parser = base.pipe(
            then(fail("deez nuts")),
            reason(x => `${x.reason}! gottem!`)
        );
        expect(parser.parse("abc")).toMatchObject({
            kind: "Soft",
            reason: "deez nuts! gottem!"
        });
    });
});
