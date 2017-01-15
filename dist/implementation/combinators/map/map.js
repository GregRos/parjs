"use strict";
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var common_1 = require("../../common");
/**
 * Created by User on 21-Nov-16.
 */
var MapParser = (function (_super) {
    tslib_1.__extends(MapParser, _super);
    function MapParser(inner, map) {
        var _this = _super.call(this) || this;
        _this.inner = inner;
        _this.map = map;
        _this.displayName = "map";
        _this.isLoud = true;
        inner.isLoud || common_1.Issues.quietParserNotPermitted(_this);
        _this.expecting = inner.expecting;
        return _this;
    }
    MapParser.prototype._apply = function (ps) {
        var _a = this, inner = _a.inner, map = _a.map;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.value = map(ps.value);
    };
    return MapParser;
}(action_1.ParjsAction));
exports.MapParser = MapParser;

//# sourceMappingURL=map.js.map
