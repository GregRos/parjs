/* eslint-disable @typescript-eslint/no-explicit-any */

export function cloneDeep<T>(source: T): T {
    if (typeof source !== "object" || !source) {
        return source;
    }
    if (Array.isArray(source)) {
        return source.map(x => cloneDeep(x)) as never;
    }
    const newObj = Object.create(Object.getPrototypeOf(source));
    for (const key of Object.keys(source)) {
        newObj[key] = cloneDeep((source as never)[key]);
    }
    return newObj;
}

// Based on lodash's implementation: https://github.com/lodash/lodash
function _defaultsDeep(target: any, source: any) {
    target = Object(target);
    if (!source) return target;
    source = Object(source);
    for (const key of Object.keys(source)) {
        const value = source[key];
        if (typeof target[key] === "object") {
            defaultsDeep(target[key], Object(value));
        } else {
            if (target[key] === undefined) {
                target[key] = value;
            }
        }
    }
    return target;
}

export function defaultsDeep<A, B>(target: A, ...sources: B[]): A & B {
    for (const source of sources) {
        target = _defaultsDeep(target, source);
    }
    return target as A & B;
}

export function defaults<T extends object, S extends Record<keyof T, unknown>>(
    arg: T | undefined,
    ...sources: (S | undefined)[]
): T & S {
    const target = Object(arg);
    for (const source of sources) {
        if (!source) {
            continue;
        }
        for (const key of Object.keys(source) as (keyof T)[]) {
            if (!(key in target) || target[key] === undefined) {
                target[key] = source[key] as any;
            }
        }
    }
    return target as T & S;
}

export function clone<T>(source: T): T {
    if (typeof source !== "object" || !source) {
        return source;
    }
    if (Array.isArray(source)) {
        return source.slice() as never;
    }
    const newObj = Object.create(Object.getPrototypeOf(source));
    for (const key of Object.keys(source) as (keyof T)[]) {
        newObj[key] = source[key];
    }
    return newObj;
}

export function range(start: number, end: number): number[] {
    const arr = [];
    for (let i = start; i < end; i++) {
        arr.push(i);
    }
    return arr;
}
