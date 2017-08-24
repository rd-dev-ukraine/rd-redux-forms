"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entries = function (data) {
    return Object.keys(data)
        .map(function (field) { return ([field, data[field]]); });
};
exports.isNullOrEmptyArray = function (array) { return !array || !array.length; };
//# sourceMappingURL=utils.js.map