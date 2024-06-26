import { got, type Response, type ResponseType } from "got";
import type { Parjser } from "parjs";
import type { getParsedType } from "parjs/internal";
import { Roarr } from "roarr";
import cache from "./cache.js";
import { UCD } from "./files.js";

export type UnicodeVersion = `${number}.${number}.${number}` | "latest";

export class ConfigurableFetcher {
    constructor(
        private readonly _unicodeVersion: UnicodeVersion,
        private readonly _useDedicatedCache = true
    ) {}

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
        if (cached && this._useDedicatedCache) {
            Roarr.info({ url, filename }, "Returning cached file");
            return cached as any;
        }
        Roarr.info({ url, filename }, "Fetching file");
        const start = Date.now();
        const response = (await got(url, {
            responseType: responseType,
            cache: cache
        })) as Response<Buffer | string>;
        await cache.set(url, response.body);
        Roarr.info({ url, filename, duration: Date.now() - start }, "Fetched file");
        return response.body as any;
    }

    async fetchText(filename: UCD.FileName) {
        const result = await this.fetch(filename, "text");
        return result;
    }

    async fetchParsed<FileToParser extends Record<keyof FileToParser & UCD.FileName, Parjser<any>>>(
        fileToParser: FileToParser,
        userData?: any
    ): Promise<{
        [K in keyof FileToParser]: getParsedType<FileToParser[K]>;
    }> {
        return Object.fromEntries(
            await Promise.all(
                Object.entries(fileToParser as Record<string, Parjser<any>>).map(
                    async ([filename, parser]) => {
                        const text = await this.fetchText(filename as UCD.FileName);
                        const start = Date.now();
                        Roarr.info({ filename: filename as string }, "Parsing file");
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
