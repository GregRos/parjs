/**
 * @module parjs/internal
 */ /** */
import {Trace} from "../reply";

/**
 * An object used to convert failure trace information into a plain-text visualization of an error
 */
export interface TraceVisualizer {
    (trace : Trace) : string;
}
