import { UCD } from "@unimatch/fetcher";
import { Fetcher } from "./fetcher.js";
import {
    UniBlock,
    UniCategory,
    UniScript,
    type UniProp,
    type UniPropTypeName
} from "./nodes/graph.impl.js";

export class UniGraph {
    constructor(readonly props: Map<string, UniProp<any>>, readonly Map<number, ) {}

    prop<T extends UniPropTypeName>(type: T, name: string) {
        const prop = this._byNameOrAlias.get(name);
        if (prop) {
            if (!prop.isOfType(type)) {
                throw new Error(`Property ${name} is not of type ${type}`);
            }
            return prop;
        }
        throw new Error(`Property not found: ${name}`);
    }

    static async create(codepoints: boolean) {
        
    }
}
