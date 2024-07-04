export class Range {
    readonly end: number;
    constructor(
        readonly start: number,
        end: number | undefined = start
    ) {
        this.end = end ?? start;
    }

    toString() {
        return this.start === this.end
            ? `Range[${this.start}]`
            : `Range[${this.start}..${this.end}]`;
    }

    static from(range: [number, number | undefined]) {
        return new Range(range[0], range[1]);
    }

    contains(codepoint: number | { code: number }) {
        codepoint = typeof codepoint === "number" ? codepoint : codepoint.code;
        return this.start <= codepoint && codepoint <= this.end;
    }

    *[Symbol.iterator]() {
        for (let i = this.start; i <= this.end; i++) {
            yield i;
        }
    }
}
