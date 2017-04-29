/**
 * @module parjs/internal
 */ /** */
import {
    PrsSeq
    , MapParser, PrsStr, PrsNot, PrsQuiet, PrsMapResult, PrsAlts, PrsBacktrack, PrsMust, PrsMustCapture, PrsMany, PrsSeqFunc, PrsExactly, PrsManyTill, PrsManySepBy, PrsAltVal} from './implementation/combinators';
import {BaseParjsParser} from "./implementation/parser";
import _ = require('lodash');
import {ParjsAction, ParjsBasicAction} from "./implementation/action";
import {Predicates} from "./implementation/functions/predicates";
import {LoudParser} from "../loud";
import {ReplyKind} from "../reply";
import {FailureReply} from './reply';
import {QuietParser} from "../quiet";
import {AnyParser} from "../any";
import {PrsSoft} from "./implementation/combinators/alternatives/soft";
import {ActParser} from "./implementation/combinators/map/act";
import {ParjsStaticHelper} from "../parjs";
import {AnyParserAction} from "./action";
import {Parjs} from '../';
function wrap(action : ParjsAction) {
    return new ParjsParser(action);
}


export class ParjsParser extends BaseParjsParser implements LoudParser<any>, QuietParser{

    mixState(newState  : any) : ParjsParser {
        return Parjs.nop.act(userState =>
            Object.assign(userState, newState)).then(this);
    }

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

    mustCapture(failType : ReplyKind.Fail = ReplyKind.HardFail) {
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
        //f is (result, userState) => any if this.isLoud
        //f is (userState) => any otherwise
        let mapper : (result : any, state : any) => any;
        if (this.isLoud) {
            mapper = f;
        } else {
            mapper = (result, state) => f(state);
        }
        return wrap(new MapParser(this.action, mapper)).withName("map");
    }

    act(f) {
        //f is (result, userState) => void if this.isLoud
        //f is (userState) => void otherwise.
        let mapper : (result : any, userState : any) => void;
        if (this.isLoud) {
            mapper = f;
        } else {
            mapper = (result, userState) => f(userState);
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

    manyTill(till : AnyParser | any, tillOptional = false) {
        if (_.isFunction(till)) {
            return this.must(till, undefined, ReplyKind.SoftFail).many()
        }
        return wrap(new PrsManyTill(this.action, till.action, tillOptional)).withName("manyTill");
    }

    manySepBy(sep : AnyParser, maxIterations = Infinity) {
        return wrap(new PrsManySepBy(this.action, sep.action, maxIterations)).withName("manySepBy");
    }

    exactly(count : number) {
        return wrap(new PrsExactly(this.action, count)).withName("exactly");
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

    cast<S>() {
        return this;
    }

    get str() {
        return wrap(new PrsStr(this.action)).withName("str");
    }

    must(condition : Function, name = "(unnamed condition)", fail : ReplyKind.Fail = ReplyKind.HardFail) {
        let cond = condition;
        if (!this.isLoud) {
            cond = (x, state) => condition(state);
        }
        return wrap(new PrsMust(this.action, cond as any, fail, name)).withName("must");
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
        }, `be non-empty`, ReplyKind.HardFail).withName("mustBeNonEmpty");
    }

    withName(newName : string) {
        (this as {displayName : string}).displayName = newName;
        return this;
    }

}