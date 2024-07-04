import { Cache } from "file-system-cache";
import { tmpdir } from "os";
export function createCache(ns: string) {
    return new Cache({
        basePath: `${tmpdir()}/parjs/unicode-info`,
        ns,
        ttl: 1000 * 60 * 60 // 1 hour
    });
}

export default createCache;
