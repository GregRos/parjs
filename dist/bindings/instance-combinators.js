"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by User on 22-Nov-16.
 */
const combinators_1 = require("../implementation/combinators");
const parser_1 = require("../base/parser");
const predicates_1 = require("../functions/predicates");
const result_1 = require("../abstract/basics/result");
const soft_1 = require("../implementation/combinators/alternatives/soft");
const act_1 = require("../implementation/combinators/map/act");
function wrap(action) {
    return new ParjsParser(action);
}
class ParjsParser extends parser_1.BaseParjsParser {
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
    mustCapture(failType = result_1.ReplyKind.HardFail) {
        return wrap(new combinators_1.PrsMustCapture(this.action, failType)).withName("mustCapture");
    }
    or(...others) {
        return wrap(new combinators_1.PrsAlts([this, ...others].map(x => x.action))).withName("or");
    }
    get state() {
        let ret = wrap(new combinators_1.MapParser(this.action, (r, s) => s));
        return ret.withName("state");
    }
    map(f) {
        //f is (result, state) => any if this.isLoud
        //f is (state) => any otherwise
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
        //f is (result, state) => void if this.isLoud
        //f is (state) => void otherwise.
        let mapper;
        if (this.isLoud) {
            mapper = f;
        }
        else {
            mapper = (result, state) => f(state);
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
    must(condition, name = "(unnamed condition)", fail = result_1.ReplyKind.HardFail) {
        return wrap(new combinators_1.PrsMust(this.action, condition, fail, name)).withName("must");
    }
    mustNotBeOf(...options) {
        return this.must(x => !options.includes(x), `none of: ${options.join(", ")}`).withName("mustNotBeOf");
    }
    mustBeOf(...options) {
        return this.must(x => options.includes(x), `one of: ${options.join(", ")}`).withName("mustBeOf");
    }
    get mustBeNonEmpty() {
        return this.must(x => {
            return predicates_1.Predicates.nonEmpty(x);
        }, `be non-empty`, result_1.ReplyKind.HardFail).withName("mustBeNonEmpty");
    }
    withName(newName) {
        this.displayName = newName;
        return this;
    }
}
exports.ParjsParser = ParjsParser;

//# sourceMappingURL=instance-combinators.js.map
