import { Cache } from "file-system-cache";
import { tmpdir } from "os";

const graphCache = new Cache({
    basePath: `${tmpdir()}/parjs/unimatch/experiments`,
    ttl: 1000 * 60 * 60 * 24 * 7 // 1 week
});

export default graphCache;
