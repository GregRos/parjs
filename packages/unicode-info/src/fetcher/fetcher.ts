import type { Cache } from "file-system-cache";
import { got, type Response, type ResponseType } from "got";
import type { Parjser } from "parjs";
import type { getParsedType } from "parjs/internal";
import { Roarr } from "roarr";
import { createCache } from "../cache.js";
import type { WebOptions } from "../nodes/unicode-options.js";
import { UCD } from "./files.js";
const cache = Object.assign(createCache("fetcher"), {
    async delete(this: Cache, x: string) {
        const isIn = this.get(x);
        await this.remove(x);
        return !!isIn;
    }
});
export type UnicodeVersion = `${number}.${number}.${number}` | "latest";

export class ConfigurableFetcher {
    private readonly _options: WebOptions;
    constructor(
        private readonly _unicodeVersion: UnicodeVersion,
        options?: Partial<WebOptions>
    ) {
        this._options = {
            cache: "default",
            noFetch: false,
            ...options
        };
    }

    private _getUrl(filename: UCD.FileName) {
        if (this._unicodeVersion === "latest") {
            return `https://www.unicode.org/Public/UCD/latest/ucd/${filename}`;
        }
        return `https://www.unicode.org/Public/${this._unicodeVersion}/ucd/${filename}`;
    }

    async fetch<Type extends ResponseType>(
        filename: UCD.FileName,
        responseType: Type
    ): Promise<Type extends "text" ? string : Buffer> {
        const url = this._getUrl(filename);
        const cached = await cache.get(url);
        if (cached && this._options.cache === "extended") {
            Roarr.debug(
                { url, filename, size: cached.length || cached.size || cached.byteLength },
                "Returning cached file"
            );
            return cached as any;
        }
        Roarr.debug({ url, filename }, "Fetching file");
        const start = Date.now();
        const response = (await got(url, {
            responseType: responseType,
            cache: this._options.cache === "none" ? undefined : cache
        })) as Response<Buffer | string>;
        if (this._options.cache !== "none") {
            await cache.set(url, response.body);
        }
        Roarr.info({ url, filename, duration: Date.now() - start }, "Fetched file");
        return response.body as any;
    }

    async fetchText(filename: UCD.FileName) {
        const result = await this.fetch(filename, "text");
        return result;
    }

    async fetchParsed<
        FileToParser extends {
            [K in keyof FileToParser & UCD.FileName]: Parjser<any> | undefined;
        }
    >(
        fileToParser: FileToParser,
        userData?: any
    ): Promise<{
        [K in keyof FileToParser]: FileToParser[K] extends object
            ? getParsedType<FileToParser[K]>
            : never;
    }> {
        return Object.fromEntries(
            await Promise.all(
                Object.entries(fileToParser as Record<string, Parjser<any>>).map(
                    async ([filename, parser]) => {
                        const text = await this.fetchText(filename as UCD.FileName);
                        const start = Date.now();
                        Roarr.debug({ filename: filename as string }, "Parsing file");
                        const result = parser.parse(text).value;
                        Roarr.info(
                            { filename: filename as string, duration: Date.now() - start },
                            "Parsed file"
                        );
                        return [filename, result];
                    }
                )
            )
        );
    }

    // TODO: Add method to fetch Unihan.zip and extract it
}
