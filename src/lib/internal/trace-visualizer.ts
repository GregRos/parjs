/**
 * @module parjs/internal/implementation
 */
/** */
import {Trace} from "../reply";
/**
 * Created by lifeg on 4/29/2017.
 */
import {NumHelpers} from "./functions/helpers";
import repeat from "lodash/repeat";

export interface TraceVisualizerArgs {
    lineNumbers: boolean;
    linesBefore: number;
}

export interface TraceVisualizer {
    (trace: Trace): string;
    configure(args: TraceVisualizerArgs): TraceVisualizer;
}

const defaultArgs: TraceVisualizerArgs = {
    lineNumbers: true,
    linesBefore: 1
};

function newTraceVisualizer(args: TraceVisualizerArgs) {
    let visualizer: any = (trace: Trace) => {
        let rows = trace.input.split(/\r\n|\n|\r/g);
        let locRow = trace.location.row;
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
            `${trace.kind}
Row ${trace.location.row + 1}, Col ${trace.location.column + 1}
Stack: ${trace.stackTrace.map(x => x.type).filter(x => x).join(" < ")}
----
${linesVisualization}
`;
        return fullVisualization;
    };
    visualizer.configure = newTraceVisualizer as any;
    return visualizer as TraceVisualizer;
}

export const visualizeTrace = newTraceVisualizer(defaultArgs);
