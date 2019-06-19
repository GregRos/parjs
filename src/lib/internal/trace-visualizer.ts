/**
 * @module parjs/trace
 */
/** */
import {Trace} from "./result";

import {NumHelpers} from "./functions/helpers";
import repeat from "lodash/repeat";
import defaults from "lodash/defaults";

/**
 * A set of arguments for the trace visualizer.
 */
export interface TraceVisualizerArgs {
    lineNumbers: boolean;
    linesBefore: number;
}

/**
 * A function that prints out a nice visualization of where a parser failed.
 */
export interface TraceVisualizer {
    (trace: Trace): string;
    configure(args: Partial<TraceVisualizerArgs>): TraceVisualizer;
}

const defaultArgs: TraceVisualizerArgs = {
    lineNumbers: true,
    linesBefore: 1
};

function newTraceVisualizer(pAgs: Partial<TraceVisualizerArgs>) {
    let args = defaults(pAgs, defaultArgs);
    let visualizer: any = (trace: Trace) => {
        let rows = trace.input.split(/\r\n|\n|\r/g);
        let locRow = trace.location.line;
        let around = args.linesBefore;
        let firstRow = Math.max(0, locRow - around);
        let linesAround = rows.slice(firstRow, locRow + 1);

        let prefixLength = 0;
        if (args.lineNumbers) {
            let numLength = Math.floor(1 + Math.log(locRow + 1) / Math.log(10));
            let rowNumberPrefixer = (n: number) => `${NumHelpers.padInt(firstRow + n, numLength, " ")} | `;
            prefixLength = numLength + 3;
            linesAround = linesAround.map((row, i) => `${rowNumberPrefixer(i + 1)}${row}`);
        }
        let errorMarked = `${repeat(" ", prefixLength + trace.location.column)}^${trace.reason}`;
        linesAround.push(errorMarked);
        let linesVisualization = linesAround.join("\n");

        let fullVisualization =
`${trace.kind} failure at Ln ${trace.location.line + 1} Col ${trace.location.column + 1}
${linesVisualization}
Stack: ${trace.stackTrace.map(x => x.type).filter(x => x).join(" < ")}
`;
        return fullVisualization;
    };
    visualizer.configure = newTraceVisualizer as any;
    return visualizer as TraceVisualizer;
}

/**
 * Visualizes a Parjs failure.
 */
export const visualizeTrace = newTraceVisualizer(defaultArgs);
