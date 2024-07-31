import { expect, test } from "vitest";

import { float, whitespace } from "parjs";
import { between } from "parjs/combinators";

const sum = (a: number, b: number) => a + b;

test("adds 1 + 2 to equal 3", () => {
    const tupleElement = float();

    // this line causes the infinite loop or whatever.
    // comment out this line, abort vitest, then re-run vitest to watch the test pass
    const paddedElement = tupleElement.pipe(between(whitespace()));

    expect(sum(1, 2)).toBe(3);
});
