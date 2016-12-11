/**
 * Created by lifeg on 10/12/2016.
 */
/**
 * Created by lifeg on 10/12/2016.
 */
import {verifyFailure, verifySuccess} from './custom-matchers';
import {LoudParser} from "../src/abstract/combinators/loud";
import {Parjs} from "../src/bindings/parsers";
import {ResultKind} from "../src/abstract/basics/result";
import {AnyParser} from "../src/abstract/combinators/any";
import _ = require('lodash');
let goodInput = "abcd";
let softBadInput = "a";
let hardBadInput = "ab";
let excessInput = "abcde";
let uState = {};

let fstLoud = Parjs.string("ab");
let sndLoud = Parjs.string("cd");


function forParser<TParser extends AnyParser>(parser : TParser, f : (action : TParser) => void) {
    describe(`Parjs.${parser.displayName}`, () => {
        f(parser);
    });
}

describe("sequential combinators", () => {
    describe("then combinators", () => {
        describe("loud then loud", () => {
            let parser = fstLoud.then(sndLoud);
            it("succeeds", () => {
                verifySuccess(parser.parse(goodInput), ["ab", "cd"]);
            });
            it("fails softly on first fail", () => {
                verifyFailure(parser.parse(softBadInput), ResultKind.SoftFail);
            });
            it("fails hard on 2nd fail", () => {
                verifyFailure(parser.parse(hardBadInput), ResultKind.HardFail);
            });
            it("fails on excess input", () => {
                verifyFailure(parser.parse(excessInput), ResultKind.SoftFail);
            });
        });

        describe("loud then quiet", () => {
            let parser = fstLoud.then(sndLoud.quiet);
            it("succeeds", () => {
                verifySuccess(parser.parse(goodInput), "ab");
            });
        });

        describe("quiet then loud", () => {
            let parser = fstLoud.quiet.then(sndLoud);
            it("succeeds", () => {
                verifySuccess(parser.parse(goodInput), "cd");
            });
        });

        describe("quiet then quiet", () => {
            let parser = fstLoud.quiet.then(sndLoud.quiet);
            it("succeeds", () => {
                verifySuccess(parser.parse(goodInput), undefined);
            });
        });

        describe("loud then loud then zero-consuming quiet", () => {
            let parser = fstLoud.then(sndLoud).then(Parjs.eof);
            it("succeeds", () => {
                verifySuccess(parser.parse(goodInput), ["ab", "cd"]);
            });
            it("fails hard when 3rd fails", () => {
                verifyFailure(parser.parse(excessInput), ResultKind.HardFail);
            });
        });

        describe("1 quiet using seq combinator", () => {
            let parser = Parjs.seq(fstLoud.quiet);
            it("succeeds with empty array value", () => {
                verifySuccess(parser.parse("ab"), []);
            });
        });

        describe("empty seq combinator same as no match, return []", () => {
            let parser = Parjs.seq();
            it("succeeds on empty input", () => {
                verifySuccess(parser.parse(""), []);
            });

            it("fails on excess input", () => {
                verifyFailure(parser.parse("a"), ResultKind.SoftFail);
            })
        });
    });

    describe("many combinators", () => {
       describe("regular many", () => {
           let parser = fstLoud.many();
           it("success on empty input", () => {
               verifySuccess(parser.parse(""), []);
           });
           it("failure on non-empty input without any matches", () => {
               verifyFailure(parser.parse("12"), ResultKind.SoftFail);
           });
           it("success on single match", () => {
               verifySuccess(parser.parse("ab"), ["ab"]);
           });
           it("success on N matches", () => {
               verifySuccess(parser.parse("ababab"), ["ab", "ab", "ab"])
           });
           it("chains to EOF correctly", () => {
               let endEof = parser.then(Parjs.eof);
               verifySuccess(endEof.parse("abab"), ["ab", "ab"])
           });

       });

       describe("many with zero-length match", () => {
           let parser = Parjs.result(0).many();
           it("guards against zero match in inner parser", () => {
               expect(() => parser.parse("abab")).toThrow();
           });

           it("ignores guard when given max iterations", () => {
               let parser = Parjs.result(0).many(undefined, 10);
               verifySuccess(parser.parse(""), _.range(0, 10).map(x => 0));
           });
       });

       describe("many with min successes", () => {
           let parser = fstLoud.many(2);
           it("succeeds when number of successes >= minimum", () => {
               verifySuccess(parser.parse("abab"), ["ab", "ab"]);
           });

           it("fails when number of successses < minimum", () => {
               verifyFailure(parser.parse("ab"), ResultKind.HardFail);
           });
       });

       describe("many with bounded iterations, min successes", () => {
           it("guards against impossible requirements", () => {
               expect(() => fstLoud.many(2, 1)).toThrow();
           });
           let parser = fstLoud.many(1, 2);
           it("succeeds when appropriate", () => {
               verifySuccess(parser.parse("abab"), ["ab", "ab"]);
           });
           it("fails when there is excess input", () => {
               verifyFailure(parser.parse("ababab"), ResultKind.SoftFail);
           });
       });

       describe("many on quiet parser", () => {
           let parser = fstLoud.quiet.many();
           it("succeeds without a value", () => {
               verifySuccess(parser.parse("abab"), undefined);
           })
       })
    });

    describe("exactly combinator", () => {
        let parser = fstLoud.exactly(2);
        it("succeeds with exact matches", () => {
            verifySuccess(parser.parse("abab"), ["ab", "ab"]);
        });
        it("quiet exactly succeeds without value", () => {
            let parser = fstLoud.quiet.exactly(2);
            verifySuccess(parser.parse("abab"), undefined);
        });
        it("hard fails with 0 < matches <= N", () => {
            verifyFailure(parser.parse("ab"), ResultKind.HardFail);
        });
        it("soft fails with matches == 0", () => {
            verifyFailure(parser.parse("a"), ResultKind.SoftFail);
        });
    });

    describe("manySepBy combinator", () => {
        let parser = fstLoud.manySepBy(Parjs.string(", "));
        it("succeeds with empty input", () => {
            verifySuccess(parser.parse(""), []);
        });

        it("succeeds with non-empty input", () => {
            verifySuccess(parser.parse("ab, ab"), ["ab", "ab"]);
        });

        it("chains into terminating separator", () => {
            let parser2 = parser.then(Parjs.string(", ").quiet);
            verifySuccess(parser2.parse("ab, ab, "), ["ab", "ab"])
        });
        it("fails soft if first many fails", () => {
            verifyFailure(parser.parse("xa"), ResultKind.SoftFail);
        });
    });

    describe("manyTill combinator", () => {
        let parser = fstLoud.manyTill(sndLoud);
        it("succeeds matching 1 then till", () => {
            verifySuccess(parser.parse("abcd"), ["ab"]);
        });
        it("succeeds matching 1 then till, chains", () => {
            let parser2 = parser.then(fstLoud.quiet);
            verifySuccess(parser2.parse("abcdab"), ["ab"]);
        });
        it("fails soft when many fails 1st time without till", () => {
            verifyFailure(parser.parse("1"), ResultKind.SoftFail);
        });
        it("fails hard when many fails 2nd time without till", () => {
            verifyFailure(parser.parse("ab1"), ResultKind.HardFail);
        });
    });
});

