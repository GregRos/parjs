import type { ParjsFailure } from "@lib";
import { string, whitespace } from "@lib";
import { exactly, manySepBy, then } from "@lib/combinators";
import { visualizeTrace } from "@lib/internal/trace-visualizer";

describe("trace", () => {
    string("a").pipe(manySepBy(whitespace()));
    describe("single line input", () => {
        const input = "a".repeat(4);
        const res = string("a").pipe(exactly(5)).parse(input) as ParjsFailure;
        const { trace } = res;
        it("correct position", () => {
            expect(trace.position).toEqual(4);
        });

        it("correct kind", () => {
            expect(trace.kind).toBe("Hard");
            expect(res.kind).toBe(trace.kind);
            expect(res.reason).toBe(trace.reason);
        });
        const location = trace.location;

        it("correct input", () => {
            expect(trace.input).toBe(input);
        });

        it("correct line 0", () => {
            expect(location.line).toBe(0);
        });

        it("correct col", () => {
            expect(location.column).toBe(4);
        });
    });

    describe("line breaks \\n", () => {
        const input = "\n".repeat(11) + "a".repeat(4);
        const parser = whitespace().pipe(then(string("a").pipe(exactly(5))));
        const res = parser.parse(input) as ParjsFailure;
        const { trace } = res;
        it("correct position", () => {
            expect(trace.position).toBe(15);
        });

        it("correct column 4", () => {
            expect(trace.location.column).toBe(4);
        });

        it("correct line 11", () => {
            expect(trace.location.line).toBe(11);
        });
    });

    describe("line breaks mixed", () => {
        const input = "\r\n".repeat(3) + "\r".repeat(3) + "\n".repeat(3) + "a".repeat(4);
        const parser = whitespace().pipe(then(string("a").pipe(exactly(5))));

        const res = parser.parse(input) as ParjsFailure;
        const { trace } = res;
        it("correct message", () => {
            const traceOutput = visualizeTrace.configure({
                lineNumbers: true
            })(trace);
            expect(traceOutput).toMatchInlineSnapshot(`
                "Hard failure at Ln 9 Col 5
                8 | 
                9 | aaaa
                        ^expecting 'a'

                Stack:
                expecting 'a' (string)
                expecting 'a' (exactly)
                expecting a character matching a predicate (then)
                "
            `);
        });

        it("correct position", () => {
            expect(trace.position).toBe(16);
        });

        it("correct column", () => {
            expect(trace.location.column).toBe(4);
        });

        it("correct line", () => {
            expect(trace.location.line).toBe(8);
        });
    });
});
