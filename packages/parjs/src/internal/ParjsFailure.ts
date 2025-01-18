import { ParjsParsingFailure } from "../errors";
import type { FailureInfo, Trace } from "./result";
import { visualizeTrace } from "./trace-visualizer";

/** A failure result from a Parjs parser. */

export class ParjsFailure implements FailureInfo {
    constructor(public trace: Trace) {}

    get value(): never {
        throw new ParjsParsingFailure(this);
    }

    get kind() {
        return this.trace.kind;
    }

    get reason() {
        return this.trace.reason;
    }

    toString() {
        return visualizeTrace(this.trace);
    }
    /** Whether this result is an OK. */
    get isOk() {
        return false;
    }
}
