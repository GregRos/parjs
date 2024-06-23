export interface NonSerializableValue {
    type: string;
    representation: string;
}

export type EdgeKey = string | number;

interface _ParserNode {
    readonly key: readonly [EdgeKey, ...EdgeKey[]] | readonly [];
    readonly id: number;
    readonly params: Record<string, number | string | boolean | NonSerializableValue>;
    readonly type: string;
    readonly name?: string;
    readonly expecting: string;
}

export interface LeafNode extends _ParserNode {
    readonly isLeaf: false;
}

export interface BranchNode extends _ParserNode {
    readonly isLeaf: true;
    readonly branches: Record<string, ParserNode> | ParserNode[];
}

export type ParserNode = LeafNode | BranchNode;
