"use strict";
var instance_combinators_1 = require("./instance-combinators");
/**
 * Created by lifeg on 07/12/2016.
 */
function wrap(action) {
    return new instance_combinators_1.ParjsParser(action);
}
