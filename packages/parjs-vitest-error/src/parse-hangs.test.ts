import { expect, test } from "vitest";

import { float, whitespace } from "parjs";
import { between } from "parjs/combinators";

test("adds 1 + 2 to equal 3", () => {
    // this line causes the infinite loop or whatever.
    // comment out this line, abort vitest, then re-run vitest to watch the test pass
    const parser = float().pipe(between(whitespace()));
    const parseResult = parser.parse("1");
    expect(parseResult).toMatchInlineSnapshot(`
      ParjsSuccess {
        "kind": "OK",
        "value": 1,
      }
    `);
});
