import { string } from "@lib";
import { later } from "@lib/combinators";
import type { ParjserBase } from "@lib/internal";

describe("later", () => {
    const internal = string("a") as ParjserBase<string>;
    const parser = later<string>();

    it("throws when not init", () => {
        expect(() => later().parse("")).toThrow();
    });

    parser.init(internal);

    it("throws when double init", () => {
        expect(() => parser.init(internal)).toThrow();
    });

    it("first success", () => {
        expect(parser.parse("a")).toBeSuccessful("a");
    });

    it("second success", () => {
        expect(parser.parse("a")).toBeSuccessful("a");
    });

    it("fail", () => {
        expect(parser.parse("")).toBeFailure("Soft");
    });

    it("expecting after init", () => {
        expect((parser as unknown as ParjserBase<string>).expecting).toEqual(internal.expecting);
    });
});
