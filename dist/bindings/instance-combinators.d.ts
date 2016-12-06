import { BaseParjsParser } from "../base/parser";
export declare class ParjsParser extends BaseParjsParser implements LoudParser<any>, QuietParser {
    readonly backtrack: ParjsParser;
    mustCapture(failType?: ResultKind): ParjsParser;
    or(...others: AnyParser[]): ParjsParser;
    map(f: (result: any) => any): ParjsParser;
    readonly quiet: ParjsParser;
    then(next: AnyParser | ((result: any) => LoudParser<any>)): ParjsParser;
    many(minSuccesses?: number, maxIters?: number): ParjsParser;
    manyTill(till: AnyParser, tillOptional?: boolean): ParjsParser;
    manySepBy(sep: AnyParser, maxIterations?: number): ParjsParser;
    exactly(count: number): ParjsParser;
    withState(reducer: (state: any, result: any) => any): ParjsParser;
    result(r: any): ParjsParser;
    readonly not: ParjsParser;
    orVal(x: any): ParjsParser;
    cast(): this;
    readonly str: ParjsParser;
    must(condition: (result: any) => boolean, name?: string, fail?: ResultKind): ParjsParser;
    mustNotBeOf(...options: any[]): ParjsParser;
    mustBeOf(...options: any[]): ParjsParser;
    readonly mustBeNonEmpty: ParjsParser;
    alts(...others: AnyParser[]): ParjsParser;
}
