import { SignalKind } from "./signals";

import type { ParseGraphNode } from "./parse-graph";

export type OkayResult<R> = {
    readonly isOkay: true;
    readonly value: R;
};
export type NotOkayResult = {
    readonly isOkay: false;
    readonly reason: string;
    readonly path: ParseGraphNode[];
    readonly input: string;
    readonly position: number;
    readonly signalKind: SignalKind;
};
export type Result<R> = OkayResult<R> | NotOkayResult;
