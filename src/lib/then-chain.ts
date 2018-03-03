import {LoudParser} from "./loud";

export function thenConcat<T, S = T>(this : LoudParser<T[]>, other : LoudParser<S>) : LoudParser<(T | S)[]>;
export function thenConcat<T, S = T>(this : LoudParser<T>, other : LoudParser<S[]>) : LoudParser<(T | S)[]>;
export function thenConcat(this : LoudParser<string>, other : LoudParser<string>) : LoudParser<string>;
export function thenConcat(this : LoudParser<string>, other : LoudParser<string>) : LoudParser<string>;
export function thenConcat<T, S = T>(this : any, other : any) : any{

}


export const convertibleSymbol = Symbol("ParjsConvertible");

export interface ConvertibleToLoudParser<S> {
    [convertibleSymbol] : LoudParser<S>;
}

export type ImplicitP<T> = LoudParser<T> | ConvertibleToLoudParser<T>;

export function accept<V>(x : ImplicitP<V>) {
    return x as LoudParser<V>;
}

declare global {
    interface String extends ConvertibleToLoudParser<string> {

    }
}

accept("").map(x => x);

interface X<T> extends LoudParser<T> {

}



