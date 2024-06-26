import prettyMilliseconds from "pretty-ms";

export function timed<T>(arg: T, f: (x: T) => void) {
    const start = Date.now();
    for (let i = 0; i < 5; i++) {
        f(arg);
    }
    console.log(`${f.name} took: ${prettyMilliseconds(Date.now() - start)}`);
}
