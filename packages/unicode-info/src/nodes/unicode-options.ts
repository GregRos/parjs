import type { UnicodeVersion } from "../fetcher/fetcher.js";
import type { DataFlags } from "./api/shared.api.js";

export interface WebOptions {
    cache: "none" | "default" | "extended";
    noFetch: boolean;
}

export interface GraphOptions {
    useCache: boolean;
}

export interface UnicodeOptions<Data extends DataFlags> {
    version: UnicodeVersion;
    dataFlags: Data[];
    web?: Partial<WebOptions>;
    graph?: Partial<GraphOptions>;
}
