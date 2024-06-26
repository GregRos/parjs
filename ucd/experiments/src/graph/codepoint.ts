import { UniBlock, UniCategory, UniPropValue, UniScript } from "@unimatch/parser";

export type AbsCodepoint<Combination extends Record<keyof Combination, UniPropValue<any>>> = {
    [K in keyof Combination]: Combination[K];
} & {
    code: number;
    name: string;
    combination: Combination & { seqId: number };
};

export type CodepointClassType<Props extends Record<keyof Props, UniPropValue<any>>> = {
    new (code: number, name: string, props: Props): AbsCodepoint<Props>;
};

export function Factory<Props extends Record<keyof Props, UniPropValue<any>>>(ctors: {
    [K in keyof Props]: { new (...args: any[]): Props[K] };
}) {
    const CodepointClass = class Codepoint {
        constructor(
            readonly code: number,
            readonly name: string,
            readonly combination: Props
        ) {}

        toString() {
            return `Codepoint[${this.code} '${this.name}']`;
        }
    };
    // We do it like this because there are 150k codepoints, if we add properties to each one
    // it would waste memory.
    for (const key of Object.keys(ctors)) {
        Object.defineProperty(CodepointClass.prototype, key, {
            get(this: InstanceType<typeof CodepointClass>) {
                return (this.combination as any)[key];
            }
        });
    }
    return CodepointClass as any as CodepointClassType<Props>;
}

export class Combination {
    constructor(
        readonly seqId: number,
        readonly block: UniBlock,
        readonly script: UniScript,
        readonly category: UniCategory
    ) {}
}

Combination.prototype.toString = function toString() {
    return `${this.block.value}|${this.script.value}|${this.category.value})`;
};

export const Codepoint = Factory<Omit<Combination, "seqId">>({
    block: UniBlock,
    script: UniScript,
    category: UniCategory
});

export type Codepoint = InstanceType<typeof Codepoint>;
