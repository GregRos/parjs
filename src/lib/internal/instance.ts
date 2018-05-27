/**
 * @module parjs/internal
 */ /** */
import {
    PrsSequence
    , PrsProject, PrsStringify, PrsInverse, PrsQuieten, PrsProjectConst, PrsAlternatives, PrsBacktrack, PrsMust, PrsMustCapture, PrsMany, PrsChoose, PrsExactly, PrsManyTill, PrsManySepBy, PrsMaybe} from "./implementation/combinators";
import {BaseParjsParser} from "./implementation";
import isFunction = require("lodash/isFunction");
import {ParjsAction} from "./implementation/action";
import {Predicates} from "./implementation/functions";
import {LoudParser} from "../loud";
import {ReplyKind} from "../reply";
import {QuietParser} from "../quiet";
import {AnyParser} from "../any";
import {PrsSoften} from "./implementation/combinators/alternatives/soft";
import {PrsEach} from "./implementation/combinators/map/act";
import {Parjs} from "../index";
import {PrsIsolate} from "./implementation/combinators/special/isolate";
import {QUIET_RESULT} from "./implementation";
import {ImplicitAnyParser} from "../convertible-literal";
import {ConversionHelper} from "./convertible-literal";
function wrap(action : ParjsAction) {
    return new ParjsParser(action);
}

function flattenNestedArrays(arr : any[]) {
    if (!Array.isArray(arr)) {
        return [arr];
    }
    let items = [];
    for (let item of arr) {
        if (Array.isArray(item)) {
            items.push(...flattenNestedArrays(item));
        } else {
            items.push(item);
        }
    }
    return items;
}

export class ParjsParser extends BaseParjsParser implements LoudParser<any>, QuietParser{
    thenChoose(selector : (x : any, state : any) => any) : any {
        return wrap(new PrsChoose(this.action, selector)).withName("thenChoose") as any;
    }

    between(preceding : ImplicitAnyParser, proceeding ?: ImplicitAnyParser)  {
        let bet : any;
        preceding = ConversionHelper.convert(preceding);
        proceeding = ConversionHelper.convert(proceeding);
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

    maybe(x ?: any) : QuietParser & LoudParser<any> {
        if (arguments.length > 0) {
            return wrap(new PrsMaybe(this.action, x)).withName("maybe");
        } else {
            return wrap(new PrsMaybe(this.action, QUIET_RESULT)).withName("maybe")
        }
    }

    or(...others : any[]) : any {
        others = others.map(p => ConversionHelper.convert(p));
        return wrap(new PrsAlternatives([this, ...others].map(x => x.action))).withName("or");
    }

    get state(): LoudParser<any> {
        let ret = wrap(new PrsProject(this.action, (r, s) => s));
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
        return wrap(new PrsProject(this.action, mapper)).withName("map");
    }

    each(f) {
        //f is (result, userState) => void if this.isLoud
        //f is (userState) => void otherwise.
        let mapper : (result : any, userState : any) => void;
        if (this.isLoud) {
            mapper = f;
        } else {
            mapper = (result, userState) => f(userState);
        }
        return wrap(new PrsEach(this.action, mapper)).withName("each");
    }

    get q() {
        return wrap(new PrsQuieten(this.action)).withName("quiet");
    }

    get soft() {
        return wrap(new PrsSoften(this.action)).withName("soften");
    }

    then(...args : any[]) : any {
        let next : AnyParser[];
        let unpack = false;

        if (args.length === 0) {
            return this;
        }
        else if (Array.isArray(args[0])) {
            next = args[0];
        }
        else if (Parjs.helper.isParser(args[0]) || typeof args[0] === "string" || args[0] instanceof RegExp) {
            unpack = true;
            next = args;
        }
        next = next.map(p => ConversionHelper.convert(p));
        let actions = [this.action, ...next.map(x => x.action)];
        let seqParse = wrap(new PrsSequence(actions));
        let loudCount = actions.filter(x => x.isLoud).length;
        let ret;
        if (unpack && loudCount === 1) {
            ret = seqParse.map(x => x[0]);
        } else if (unpack  && loudCount === 0) {
            ret = seqParse.q;
        } else {
            ret = seqParse;
        }
        return ret.withName("then");
    }
    many(minSuccesses : number = 0, maxIters : number = Infinity) {
        return wrap(new PrsMany(this.action, maxIters, minSuccesses)).withName("many");
    }

    manyTill(till : ImplicitAnyParser | any, tillOptional = false) {
        till = ConversionHelper.convert(till);
        if (isFunction(till)) {
            return this.must(till, undefined, ReplyKind.SoftFail).many()
        }
        return wrap(new PrsManyTill(this.action, till.action, tillOptional)).withName("manyTill");
    }

    manySepBy(sep : ImplicitAnyParser, maxIterations = Infinity) {
        sep = ConversionHelper.convert(sep);
        return wrap(new PrsManySepBy(this.action, sep.action, maxIterations)).withName("manySepBy");
    }

    exactly(count : number) {
        return wrap(new PrsExactly(this.action, count)).withName("exactly");
    }

    result(r : any) {
        return wrap(new PrsProjectConst(this.action, r)).withName("result");
    }

    get not() {
        return wrap(new PrsInverse(this.action)).withName("not");
    }

    cast<S>() {
        return this;
    }

    get str() {
        return wrap(new PrsStringify(this.action)).withName("str");
    }

    must(condition : Function, name = "(unnamed condition)", fail : ReplyKind.Fail = ReplyKind.HardFail) {
        let cond = condition;
        if (!this.isLoud) {
            cond = (x, state) => condition(state);
        }
        return wrap(new PrsMust(this.action, cond as any, fail, name)).withName("must");
    }

    mustNotBeOf(options : any[], fail = ReplyKind.HardFail) {
        return this.must(x => options.indexOf(x) < 0, `none of: ${options.join(", ")}`, fail).withName("mustNotBeOf");
    }

    mustBeOf(options : any[], fail = ReplyKind.HardFail) {
        return this.must(x => options.indexOf(x) >= 0, `one of: ${options.join(", ")}`, fail).withName("mustBeOf");
    }

    mustBeNonEmpty(fail = ReplyKind.HardFail) {
        return this.must(x => {
            return Predicates.nonEmpty(x);
        }, `be non-empty`, fail).withName("mustBeNonEmpty");
    }

    withName(newName : string) {
        (this as {displayName : string}).displayName = newName;
        return this;
    }

    get isolate() {
        return wrap(new PrsIsolate(this.action)).withName(`isolated: ${this.action.displayName}`);
    }

    flatten() {
        return this.map(x => flattenNestedArrays(x));
    }

    splat() {
        return this.map((arr : any[]) => {
            let result = {};
            for (let item of arr) {
                Object.assign(result, item);
            }
            return result;
        })
    }

}