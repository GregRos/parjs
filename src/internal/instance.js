"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal
 */ /** */
const combinators_1 = require("./implementation/combinators");
const parser_1 = require("./implementation/parser");
const _ = require("lodash");
const predicates_1 = require("./implementation/functions/predicates");
const reply_1 = require("../reply");
const soft_1 = require("./implementation/combinators/alternatives/soft");
const act_1 = require("./implementation/combinators/map/act");
const _1 = require("../");
const isolate_1 = require("./implementation/combinators/special/isolate");
function wrap(action) {
    return new ParjsParser(action);
}
class ParjsParser extends parser_1.BaseParjsParser {
    mixState(newState) {
        return _1.Parjs.nop.act(userState => Object.assign(userState, newState)).then(this);
    }
    thenChoose(selector, map) {
        return wrap(new combinators_1.PrsSeqFunc(this.action, selector, map)).withName("thenChoose");
    }
    between(preceding, proceeding) {
        let bet;
        if (proceeding) {
            bet = preceding.q.then(this).then(proceeding.q);
        }
        else {
            bet = preceding.q.then(this).then(preceding.q);
        }
        return bet.withName("between");
    }
    get backtrack() {
        return wrap(new combinators_1.PrsBacktrack(this.action)).withName("backtrack");
    }
    mustCapture(failType = reply_1.ReplyKind.HardFail) {
        return wrap(new combinators_1.PrsMustCapture(this.action, failType)).withName("mustCapture");
    }
    get maybe() {
        return this.or(_1.Parjs.result(undefined));
    }
    or(...others) {
        return wrap(new combinators_1.PrsAlts([this, ...others].map(x => x.action))).withName("or");
    }
    get state() {
        let ret = wrap(new combinators_1.MapParser(this.action, (r, s) => s));
        return ret.withName("state");
    }
    map(f) {
        //f is (result, userState) => any if this.isLoud
        //f is (userState) => any otherwise
        let mapper;
        if (this.isLoud) {
            mapper = f;
        }
        else {
            mapper = (result, state) => f(state);
        }
        return wrap(new combinators_1.MapParser(this.action, mapper)).withName("map");
    }
    act(f) {
        //f is (result, userState) => void if this.isLoud
        //f is (userState) => void otherwise.
        let mapper;
        if (this.isLoud) {
            mapper = f;
        }
        else {
            mapper = (result, userState) => f(userState);
        }
        return wrap(new act_1.ActParser(this.action, mapper)).withName("act");
    }
    get q() {
        return wrap(new combinators_1.PrsQuiet(this.action)).withName("quiet");
    }
    get soft() {
        return wrap(new soft_1.PrsSoft(this.action)).withName("soften");
    }
    then(...next) {
        let actions = [this.action, ...next.map(x => x.action)];
        let seqParse = wrap(new combinators_1.PrsSeq(actions));
        let loudCount = actions.filter(x => x.isLoud).length;
        let ret;
        if (loudCount === 1) {
            ret = seqParse.map(x => x[0]);
        }
        else if (loudCount === 0) {
            ret = seqParse.q;
        }
        else {
            ret = seqParse;
        }
        return ret.withName("then");
    }
    many(minSuccesses = 0, maxIters = Infinity) {
        return wrap(new combinators_1.PrsMany(this.action, maxIters, minSuccesses)).withName("many");
    }
    manyTill(till, tillOptional = false) {
        if (_.isFunction(till)) {
            return this.must(till, undefined, reply_1.ReplyKind.SoftFail).many();
        }
        return wrap(new combinators_1.PrsManyTill(this.action, till.action, tillOptional)).withName("manyTill");
    }
    manySepBy(sep, maxIterations = Infinity) {
        return wrap(new combinators_1.PrsManySepBy(this.action, sep.action, maxIterations)).withName("manySepBy");
    }
    exactly(count) {
        return wrap(new combinators_1.PrsExactly(this.action, count)).withName("exactly");
    }
    result(r) {
        return wrap(new combinators_1.PrsMapResult(this.action, r)).withName("result");
    }
    get not() {
        return wrap(new combinators_1.PrsNot(this.action)).withName("not");
    }
    orVal(x) {
        return wrap(new combinators_1.PrsAltVal(this.action, x)).withName("orVal");
    }
    cast() {
        return this;
    }
    get str() {
        return wrap(new combinators_1.PrsStr(this.action)).withName("str");
    }
    must(condition, name = "(unnamed condition)", fail = reply_1.ReplyKind.HardFail) {
        let cond = condition;
        if (!this.isLoud) {
            cond = (x, state) => condition(state);
        }
        return wrap(new combinators_1.PrsMust(this.action, cond, fail, name)).withName("must");
    }
    mustNotBeOf(options, fail = reply_1.ReplyKind.HardFail) {
        return this.must(x => !options.includes(x), `none of: ${options.join(", ")}`, fail).withName("mustNotBeOf");
    }
    mustBeOf(options, fail = reply_1.ReplyKind.HardFail) {
        return this.must(x => options.includes(x), `one of: ${options.join(", ")}`, fail).withName("mustBeOf");
    }
    mustBeNonEmpty(fail = reply_1.ReplyKind.HardFail) {
        return this.must(x => {
            return predicates_1.Predicates.nonEmpty(x);
        }, `be non-empty`, fail).withName("mustBeNonEmpty");
    }
    withName(newName) {
        this.displayName = newName;
        return this;
    }
    get isolate() {
        return wrap(new isolate_1.PrsIsolate(this.action)).withName(`isolated: ${this.action.displayName}`);
    }
}
exports.ParjsParser = ParjsParser;
//# sourceMappingURL=instance.js.map