"use strict";
var parsers_1 = require("../src/bindings/parsers");
/**
 * Created by lifeg on 07/12/2016.
 */
describe("smoke test", function () {
    var parser = parsers_1.Parjs.anyChar;
    var input = "a";
    var failInput = "";
    expect("can parse", function () {
        var result = parser.parse(input);
        result.
        ;
    });
});
//# sourceMappingURL=basics.spec.js.map