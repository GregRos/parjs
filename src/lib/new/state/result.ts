export interface Ok<V> {
    kind: R.Ok;
    value: V;
}

interface Nope<T> {
    kind: R.Nope;
    reason: string;
}

interface Panic<T> {
    kind: R.Panic;
    reason: string;
}

interface Die<T> {
    kind: R.Die;
    reason: string;
}

export type Result<T = any> = Ok<T> | Nope<T> | Panic<T> | Die<T>;
export const enum R {
    None = 0,
    Ok = 1,
    Nope = 2,
    Panic = 3,
    Die = 4
}
