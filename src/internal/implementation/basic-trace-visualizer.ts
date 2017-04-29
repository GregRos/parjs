import {Trace} from "../reply";
/**
 * Created by lifeg on 4/29/2017.
 */
import _ = require('lodash');
import {NumHelpers} from "./functions/helpers";
import {TraceVisualizer} from "../visualizer";

export interface BasicTraceVisualizerArgs {
    lineNumbers : boolean;
    linesBefore : number;
}

const defaultArgs : BasicTraceVisualizerArgs = {
    lineNumbers : true,
    linesBefore : 1
};
export class BasicTraceVisualizer implements TraceVisualizer{
    constructor(public args : BasicTraceVisualizerArgs = defaultArgs) {

    }

    visualize(trace : Trace) {
        let rows = trace.input.split(/\r\n|\n|\r/g);
        let locRow = trace.location.row;
        let around = this.args.linesBefore;
        let firstRow = Math.max(0, locRow - around);
        let linesAround = rows.slice(firstRow, locRow + 1);

        let prefixLength = 0;
        if (this.args.lineNumbers) {
            let numLength = Math.floor(1 + Math.log10(locRow + 1));
            let rowNumberPrefixer = (n : number) => `${NumHelpers.padInt(firstRow + n, numLength, " ")} | `;
            prefixLength = numLength + 3;
            linesAround = linesAround.map((row, i) => `${rowNumberPrefixer(i + 1)}${row}`);
        }
        let errorMarked = " ".repeat(prefixLength + trace.location.column) + `^${trace.expecting}`;
        linesAround.push(errorMarked);
        let linesVisualization = linesAround.join("\n");

        let fullVisualization =
`${trace.kind}
Row ${trace.location.row + 1}, Col ${trace.location.column + 1}
Stack: ${trace.stackTrace.map(x => x.displayName).filter(x => x).join(" < ")}
----
${linesVisualization}
`;
        return fullVisualization;
    }
}