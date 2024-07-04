import type { CharFormats } from "../api/char.api.js";
import type { TypeName } from "../api/shared.api.js";
import { UniImplGraph } from "./graph.impl.js";
import { UniImplProp } from "./prop.impl.js";
import type { UniCharInput } from "./shared.impl.js";
import { normalizeToCodepoint } from "./utils.js";
import { UniImplValue } from "./value.impl.js";

export class UniImplChar {
    get _vals() {
        return this.graph._charValues!.get(this.code)!;
    }
    get script() {
        return this._vals.get(this.graph.prop("Script").transientSeqId);
    }
    get scripts() {
        return this.graph.scriptx.scriptsFor(this.code);
    }
    get block() {
        return this._vals.get(this.graph.prop("Block").transientSeqId);
    }
    get category() {
        return this._vals.get(this.graph.prop("Category").transientSeqId);
    }
    constructor(
        readonly code: number,
        readonly graph: UniImplGraph,
        readonly title: string | undefined
    ) {
        title = title?.replace("%CODEPOINT", this.toString("hex"));
        if (code < 0 || code > 1114111) {
            throw new Error(`Codepoint ${this} is outside the Unicode range`);
        }
    }

    get string() {
        return String.fromCodePoint(this.code);
    }

    toString(format?: CharFormats): string {
        format = format || "long";
        switch (format) {
            case "hex":
                return `U+${this.hex}`;
            case "char":
                return this.string;
            case "decimal":
                return `U+${this.code.toString()}`;
            case "escape":
                return `\\u{${this.hex}}`;
            case "long":
                const parts = [this.toString("hex")];
                if (this.title) {
                    parts.push(`| ${this.title}`);
                }
                parts.push(`[ ${this.string} ]`);

                return parts.join(" ");
        }
    }

    get hex() {
        return this.code.toString(16).toUpperCase().padStart(4, "0");
    }

    get values() {
        return this._vals.values();
    }

    is(char: UniCharInput) {
        char = normalizeToCodepoint(char);
        return this.code === char;
    }

    valueOf() {
        return this.string;
    }

    getValue<Type extends TypeName>(prop: UniImplProp<Type>): UniImplValue<Type> | undefined;
    getValue<Type extends TypeName>(name: string, type: Type): UniImplValue<Type> | undefined;
    getValue(...args: [UniImplProp<any>] | [string, TypeName]) {
        const prop = args.length === 1 ? args[0] : this.graph.prop(args[0], args[1]);
        if (this.graph.hasDataFlag("char:prop:val")) {
            return this._vals.get(prop.transientSeqId);
        }
        return prop.getValueFor(this);
    }
    hasProperty(name: UniImplProp | string) {
        const maybeProp = this.graph.tryProp(name);
        if (!maybeProp) {
            throw new Error(`Property not found: ${name}`);
        }
        return this._vals.has(maybeProp.transientSeqId);
    }
}
