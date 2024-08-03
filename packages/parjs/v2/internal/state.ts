import { ParseGraphNode } from "./parse-graph";

export type UserStateLeaf = string | number | boolean | null | undefined | bigint | symbol;

export type UserState = {
    [key: string]: UserStateLeaf | UserState | UserStateLeaf[];
};

export class ParseState<State extends UserState = UserState> {
    position = 0;
    readonly path: ParseGraphNode[] = [];
    constructor(
        readonly input: string,
        readonly userState: State
    ) {}

    push(pgNode: ParseGraphNode): void {
        this.path.push(pgNode);
    }

    pop(): void {
        this.path.pop();
    }
}
