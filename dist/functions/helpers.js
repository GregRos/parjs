/**
 * Created by lifeg on 25/03/2017.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class _StringHelpers {
    recJoin(arr) {
        if (arr instanceof Array) {
            return arr.map(x => this.recJoin(x)).join("");
        }
        else {
            return String(arr);
        }
    }
}
exports._StringHelpers = _StringHelpers;
exports.StringHelpers = new _StringHelpers();

//# sourceMappingURL=helpers.js.map
