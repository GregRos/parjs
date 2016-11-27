/**
 * Created by User on 22-Nov-16.
 */
import {
    PrsSeq
    , MapParser, PrsStr, PrsNot, PrsQuiet, PrsMapResult, PrsAlts, PrsBacktrack, PrsMust, PrsMustCapture, PrsMany, PrsSeqFunc, PrsExactly, PrsManyTill, PrsManySepBy, PrsWithState, PrsAltVal} from '../implementation/combinators';
import {JaseBaseParser} from "../base/jase-parser";
import _ = require('lodash');
import {JaseParserAction} from "../base/parser-action";

function wrap(action : JaseParserAction) {
    return new JaseParser(action);
}

export class JaseParser extends JaseBaseParser implements LoudParser<any>, QuietParser{
    get backtrack() {
        return wrap(new PrsBacktrack(this.action))
    }

    get mustCapture() {
        return wrap(new PrsMustCapture(this.action));
    }

    or(...others : AnyParser[]) {
        return wrap(new PrsAlts(others.map(x => x.action)));
    }

    map(f : (result : any) => any) {
        return wrap(new MapParser(this.action, f));
    }

    get quiet() {
        return wrap(new PrsQuiet(this.action));
    }

    then(next : AnyParser | ((result : any) => LoudParser<any>)) {
        if (_.isFunction(next)) {
            return wrap(new PrsSeqFunc(this.action, [next]));
        } else {
            let seqParse = wrap(new PrsSeq([this.action, next.action]));
            if (this.isLoud !== next.isLoud) {
                return seqParse.map(x => x[0]);
            } else if (!this.isLoud) {
                return seqParse.quiet;
            }
            return seqParse;
        }
    }
    many(minSuccesses : number = 0, maxIters : number = Infinity) {
        return wrap(new PrsMany(this.action, maxIters, minSuccesses));
    }

    manyTill(till : AnyParser, tillOptional = false) {
        return wrap(new PrsManyTill(this.action, till.action, tillOptional));
    }

    manySepBy(sep : AnyParser, maxIterations = Infinity) {
        return wrap(new PrsManySepBy(this.action, sep.action, maxIterations));
    }

    exactly(count : number) {
        return wrap(new PrsExactly(this.action, count));
    }

    withState(reducer : (state : any, result : any) => any) {
        return wrap(new PrsWithState(this.action, reducer));
    }

    result(r : any) {
        return wrap(new PrsMapResult(this.action, r));
    }

    get not() {
        return wrap(new PrsNot(this.action));
    }

    orVal(x : any) {
        return wrap(new PrsAltVal(this.action, x));
    }

    cast() {
        return this;
    }

    get str() {
        return wrap(new PrsStr(this.action));
    }

    must(condition : (result : any) => boolean) {
        return wrap(new PrsMust(this.action, condition));
    }

    mustNotBeOf(...options : any[]) {
        return this.must(x => !options.includes(x));
    }

    mustBeOf(...options : any[]) {
        return this.must(x => options.includes(x));
    }

    get mustBeNonEmpty() {
        return this.must(x => {
            if (x === undefined || x === null || x === "") {
                return false;
            }
            if (x instanceof Array) {
                return x.length > 0;
            }
            let proto = Object.getPrototypeOf(x);
            if (proto === Object.prototype || !proto) {
                return Object.getOwnPropertyNames(x).length > 0;
            }
            return true;
        })
    }

    alts(...others : AnyParser[]) {
        return wrap(new PrsAlts(others.map(x => x.action)));
    }
}