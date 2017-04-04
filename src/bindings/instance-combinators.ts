/**
 * Created by User on 22-Nov-16.
 */
import {
    PrsSeq
    , MapParser, PrsStr, PrsNot, PrsQuiet, PrsMapResult, PrsAlts, PrsBacktrack, PrsMust, PrsMustCapture, PrsMany, PrsSeqFunc, PrsExactly, PrsManyTill, PrsManySepBy, PrsWithState, PrsAltVal} from '../implementation/combinators';
import {BaseParjsParser} from "../base/parser";
import _ = require('lodash');
import {ParjsAction} from "../base/action";
import {Predicates} from "../functions/predicates";
import {LoudParser} from "../abstract/combinators/loud";
import {ResultKind, FailResult, FailResultKind} from "../abstract/basics/result";
import {QuietParser} from "../abstract/combinators/quiet";
import {AnyParser} from "../abstract/combinators/any";
import {PrsSoft} from "../implementation/combinators/alternatives/soft";
import {ActParser} from "../implementation/combinators/map/act";

function wrap(action : ParjsAction) {
    return new ParjsParser(action);
}

export class ParjsParser extends BaseParjsParser implements LoudParser<any>, QuietParser{

    thenChoose<TParser extends AnyParser>(selector : (x : any) => TParser, map ?: Map<any, TParser>) : TParser {
        return wrap(new PrsSeqFunc(this.action, selector, map)).withName("thenChoose") as any;
    }

    between(preceding : AnyParser, proceeding ?: AnyParser) {
        let bet : any;
        if (proceeding) {
            bet = preceding.q.then(this).then(proceeding.q);
        } else {
            bet = preceding.q.then(this).then(preceding.q);
        }
        return bet.withName("between");
    }
    get backtrack() {
        return wrap(new PrsBacktrack(this.action)).withName("backtrack");
    }

    mustState(predicate : (state : any) => boolean) {
        return this.must((r, state) => predicate(state)).withName("mustState");
    }

    mustCapture(failType : FailResultKind = ResultKind.HardFail) {
        return wrap(new PrsMustCapture(this.action, failType)).withName("mustCapture");
    }

    or(...others : AnyParser[]) {
        return wrap(new PrsAlts([this, ...others].map(x => x.action))).withName("or");
    }

    get state(): LoudParser<any> {
        let ret = wrap(new MapParser(this.action, (r, s) => s));
        return ret.withName("state");
    }

    map(f) {
        //f is (result, state) => any if this.isLoud
        //f is (state) => any otherwise
        let mapper : (result : any, state : any) => any;
        if (this.isLoud) {
            mapper = f;
        } else {
            mapper = (result, state) => f(state);
        }
        return wrap(new MapParser(this.action, mapper)).withName("map");
    }

    act(f) {
        //f is (result, state) => void if this.isLoud
        //f is (state) => void otherwise.
        let mapper : (result : any, state : any) => void;
        if (this.isLoud) {
            mapper = f;
        } else {
            mapper = (result, state) => f(state);
        }
        return wrap(new ActParser(this.action, mapper)).withName("act");
    }

    get q() {
        return wrap(new PrsQuiet(this.action)).withName("quiet");
    }

    get soft() {
        return wrap(new PrsSoft(this.action)).withName("soften");
    }

    then(...next : any[]) : any {
        let actions = [this.action, ...next.map(x => x.action)];
        let seqParse = wrap(new PrsSeq(actions));
        let loudCount = actions.filter(x => x.isLoud).length;
        let ret;
        if (loudCount === 1) {
            ret = seqParse.map(x => x[0]);
        } else if (loudCount === 0) {
            ret= seqParse.q;
        } else {
            ret= seqParse;
        }
        return ret.withName("then");
    }
    many(minSuccesses : number = 0, maxIters : number = Infinity) {
        return wrap(new PrsMany(this.action, maxIters, minSuccesses)).withName("many");
    }

    manyTill(till : AnyParser, tillOptional = false) {
        return wrap(new PrsManyTill(this.action, till.action, tillOptional)).withName("manyTill");
    }

    manySepBy(sep : AnyParser, maxIterations = Infinity) {
        return wrap(new PrsManySepBy(this.action, sep.action, maxIterations)).withName("manySepBy");
    }

    exactly(count : number) {
        return wrap(new PrsExactly(this.action, count)).withName("exactly");
    }

    withState(reducer : ((state : any, result : any) => any) | Object) {
        let reducer2 : ((state : any, result : any) => any);
        if (typeof reducer !== "function") {
            reducer2 = () => reducer;
        } else {
            reducer2 = reducer;
        }
        return wrap(new PrsWithState(this.action, reducer2)).withName("withState");
    }

    result(r : any) {
        return wrap(new PrsMapResult(this.action, r)).withName("result");
    }

    get not() {
        return wrap(new PrsNot(this.action)).withName("not");
    }

    orVal(x : any) {
        return wrap(new PrsAltVal(this.action, x)).withName("orVal");
    }

    cast() {
        return this;
    }

    get str() {
        return wrap(new PrsStr(this.action)).withName("str");
    }

    must(condition : (result : any, state : any) => boolean, name = "(unnamed condition)", fail : FailResultKind = ResultKind.HardFail) {
        return wrap(new PrsMust(this.action, condition, fail, name)).withName("must");
    }

    mustNotBeOf(...options : any[]) {
        return this.must(x => !options.includes(x), `none of: ${options.join(", ")}`).withName("mustNotBeOf");
    }

    mustBeOf(...options : any[]) {
        return this.must(x => options.includes(x), `one of: ${options.join(", ")}`).withName("mustBeOf");
    }

    get mustBeNonEmpty() {
        return this.must(x => {
            return Predicates.nonEmpty(x);
        }, `be non-empty`, ResultKind.HardFail).withName("mustBeNonEmpty");
    }

    withName(newName : string) {
        (this as {displayName : string}).displayName = newName;
        return this;
    }

}