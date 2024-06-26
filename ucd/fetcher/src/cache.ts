import { Cache } from "file-system-cache";
import { tmpdir } from "os";

const baseCache = new Cache({
    basePath: `${tmpdir()}/parjs/unimatch/fetcher`,
    ttl: 1000 * 60 * 60 * 24 * 7 // 1 week
});

const cache = Object.assign(baseCache, {
    async delete(this: Cache, x: string) {
        const isIn = this.get(x);
        await this.remove(x);
        return !!isIn;
    }
});

export default cache;
