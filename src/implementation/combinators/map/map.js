"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
var common_1 = require("../../common");
/**
 * Created by User on 21-Nov-16.
 */
var MapParser = (function (_super) {
    __extends(MapParser, _super);
    function MapParser(inner, map) {
        _super.call(this);
        this.inner = inner;
        this.map = map;
        this.displayName = "map";
        this.isLoud = true;
        common_1.Issues.quietParserNotPermitted(this);
        this.expecting = inner.expecting;
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
}(parser_action_1.JaseParserAction));
exports.MapParser = MapParser;
//# sourceMappingURL=map.js.map