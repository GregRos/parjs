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
import {ResultKind, FailIndicator, toResultKind} from "../abstract/basics/result";
import {QuietParser} from "../abstract/combinators/quiet";
import {AnyParser} from "../abstract/combinators/any";
import {PrsSoft} from "../implementation/combinators/alternatives/soft";

function wrap(action : ParjsAction) {
    return new ParjsParser(action);
}

export class ParjsParser extends BaseParjsParser implements LoudParser<any>, QuietParser{

    between(preceding : AnyParser, proceeding ?: AnyParser) {
        if (proceeding) {
            return preceding.q.then(this).then(proceeding.q);
        } else {
            return preceding.q.then(this).then(preceding.q);
        }
    }
    get backtrack() {
        return wrap(new PrsBacktrack(this.action))
    }

    mustCapture(failType : FailIndicator = ResultKind.HardFail) {
        return wrap(new PrsMustCapture(this.action, toResultKind(failType)));
    }

    or(...others : AnyParser[]) {
        return wrap(new PrsAlts([this, ...others].map(x => x.action)));
    }

    map(f : (result : any) => any) {
        return wrap(new MapParser(this.action, f));
    }

    get q() {
        return wrap(new PrsQuiet(this.action));
    }

    get soft() {
        return wrap(new PrsSoft(this.action));
    }

    then(...next : any[]) : any {
        let actions = [this.action, ...next.map(x => x.action)];
        let seqParse = wrap(new PrsSeq(actions));
        let loudCount = actions.filter(x => x.isLoud).length;
        if (loudCount === 1) {
            return seqParse.map(x => x[0]);
        } else if (loudCount === 0) {
            return seqParse.q;
        } else {
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

    withState(reducer : ((state : any, result : any) => any) | Object) {
        let reducer2 : ((state : any, result : any) => any);
        if (typeof reducer !== "function") {
            reducer2 = () => reducer;
        } else {
            reducer2 = reducer;
        }
        return wrap(new PrsWithState(this.action, reducer2));
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

    must(condition : (result : any) => boolean, name = "(unnamed condition)", fail : FailIndicator = ResultKind.HardFail) {
        return wrap(new PrsMust(this.action, condition, toResultKind(fail), name));
    }

    mustNotBeOf(...options : any[]) {
        return this.must(x => !options.includes(x), `none of: ${options.join(", ")}`);
    }

    mustBeOf(...options : any[]) {
        return this.must(x => options.includes(x), `one of: ${options.join(", ")}`);
    }

    get mustBeNonEmpty() {
        return this.must(x => {
            return Predicates.nonEmpty(x);
        }, `be non-empty`, ResultKind.HardFail);
    }

}