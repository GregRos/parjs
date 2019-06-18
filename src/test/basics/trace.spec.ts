import {string, whitespace} from "../../lib/internal/parsers";
import {exactly, manySepBy, then} from "../../lib/combinators";
import _ = require("lodash");
import {ParjsFailure} from "../../lib/internal/result";
import {visualizeTrace} from "../../lib/trace";

describe("trace", () => {
    let exampleParser = string("a").pipe(
        manySepBy(whitespace())
    );

    describe("single line input", () => {
        let input = _.repeat("a", 4);
        let res = string("a").pipe(exactly(5)).parse(input) as ParjsFailure;
        let {trace} = res;
        it("correct position", () => {
            expect(trace.position).toEqual(4);
        });

        it("correct kind", () => {
            expect(trace.kind).toBe("Hard");
            expect(res.kind).toBe(trace.kind);
            expect(res.reason).toBe(trace.reason);
        });
        let location = trace.location;

        it("correct input", () => {
            expect(trace.input).toBe(input);
        });

        it("correct line 0", () => {
            expect(location.row).toBe(0);
        });

        it("correct col", () => {
            expect(location.column).toBe(4);
        });

    });

    describe("line breaks \\n", () => {
        let input = _.repeat("\n", 11) + _.repeat("a", 4);
        let parser = whitespace().pipe(
            then(string("a").pipe(
                exactly(5)
            ))
        );
        let res = parser.parse(input) as ParjsFailure;
        let {trace} = res;
        it("correct position", () => {
            expect(trace.position).toBe(15);
        });

        it("correct column 4", () => {
            expect(trace.location.column).toBe(4);
        });

        it("correct row 11", () => {
            expect(trace.location.row).toBe(11);
        });
    });

    describe("line breaks mixed", () => {
        let input = _.repeat("\r\n", 3) + _.repeat("\r", 3) + _.repeat("\n", 3) + _.repeat("a", 4);
        let parser = whitespace().pipe(
            then(string("a").pipe(
                exactly(5)
            ))
        );

        let res = parser.parse(input) as ParjsFailure;
        let {trace} = res;
        console.log(visualizeTrace.configure({
            lineNumbers: true
        })(trace));
        it("correct position", () => {
            expect(trace.position).toBe(16);
        });

        it("correct column", () => {
            expect(trace.location.column).toBe(4);
        });

        it("correct line", () => {
            expect(trace.location.row).toBe(8);
        });
    });
});
