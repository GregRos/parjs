"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./functions/helpers");
const defaultArgs = {
    lineNumbers: true,
    linesBefore: 1
};
class BasicTraceVisualizer {
    constructor(args = defaultArgs) {
        this.args = args;
    }
    visualize(trace) {
        let rows = trace.input.split(/\r\n|\n|\r/g);
        let locRow = trace.location.row;
        let around = this.args.linesBefore;
        let firstRow = Math.max(0, locRow - around);
        let linesAround = rows.slice(firstRow, locRow + 1);
        let prefixLength = 0;
        if (this.args.lineNumbers) {
            let numLength = Math.floor(1 + Math.log10(locRow + 1));
            let rowNumberPrefixer = (n) => `${helpers_1.NumHelpers.padInt(firstRow + n, numLength, " ")} | `;
            prefixLength = numLength + 3;
            linesAround = linesAround.map((row, i) => `${rowNumberPrefixer(i + 1)}${row}`);
        }
        let errorMarked = " ".repeat(prefixLength + trace.location.column) + `^${trace.expecting}`;
        linesAround.push(errorMarked);
        let linesVisualization = linesAround.join("\n");
        let fullVisualization = `${trace.kind}
Row ${trace.location.row + 1}, Col ${trace.location.column + 1}
Stack: ${trace.stackTrace.map(x => x.displayName).filter(x => x).join(" < ")}
----
${linesVisualization}
`;
        return fullVisualization;
    }
}
exports.BasicTraceVisualizer = BasicTraceVisualizer;
//# sourceMappingURL=basic-trace-visualizer.js.map