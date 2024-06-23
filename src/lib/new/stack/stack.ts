import type { R } from "../state/result";
import type { LeafNode, ParserNode } from "./parse-tree";
export interface ParjsCaptureLog {}

export interface ParjsStackFrame {
    node: ParserNode;
}
export interface ParjsStack {
    push(frame: ParjsStackFrame): void;
    pop(): ParjsStackFrame;
    readonly length: number;
}

interface _Node {
    kind: R;
}

export interface LeafSuccessNode extends _Node {
    isLeaf: true;
    parser: LeafNode;
    kind: R.Ok;
    values: Record<string, unknown>;
    slice: [start: number, end: number];
}

export interface LeafFailureNode extends _Node {
    isLeaf: true;
    parser: LeafNode;
    kind: R.Nope | R.Panic | R.Die;
    reason: string;
}

export interface BranchSuccessNode extends _Node {
    isLeaf: false;
    kind: R.Ok;
    values: Record<string, unknown>;
    slice: [start: number, end: number];
    applied: SomeNode[];
}

export interface BranchFailureNode extends _Node {
    isLeaf: false;
    kind: R.Nope | R.Panic | R.Die;
    reason: string;
    children: SomeNode[];
}

export type SomeNode = LeafSuccessNode | LeafFailureNode | BranchSuccessNode | BranchFailureNode;
