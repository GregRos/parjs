export class ParseGraphNode {
    constructor(
        readonly baseName: string,
        readonly modifiers: readonly string[],
        readonly options: Record<string, any>,
        readonly children: Record<string, ParseGraphNode>
    ) {}
}

export class ParseGraphTrace {
    constructor(readonly root: ParseGraphNode) {}
}

export class ParseGraphPath {
    constructor(readonly nodes: readonly ParseGraphNode[]) {}
}
