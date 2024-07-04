export { Range } from "@unicode-info/parser";
export { UnicodeCharacter } from "./api/char.api.js";
export { UnicodeGraph } from "./api/graph.api.js";
export { UnicodeProperty } from "./api/prop.api.js";
export {
    DataFlags,
    getPossiblePropNames,
    getPropValue,
    StandardPropNames,
    TypeName
} from "./api/shared.api.js";
import { UnicodeGraph } from "./api/graph.api.js";
import { DataFlags } from "./api/shared.api.js";
import { UniImplGraph as UniGraphImpl } from "./impl/graph.impl.js";
import type { UnicodeOptions } from "./unicode-options.js";

/**
 * Fetches Unicode data from the Unicode database and constructs a {@link UnicodeGraph} object from
 * that data.
 *
 * @param options The options to use when fetching the Unicode data, including several layers of
 *   caching.
 * @returns
 */
export async function unicodeInfo<Data extends DataFlags>(options: UnicodeOptions<Data>) {
    return (await UniGraphImpl.create(options)) as any as UnicodeGraph<Data>;
}

export * from "./api/index.js";
