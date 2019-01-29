"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entries = function (data) {
    return Object.keys(data).map(function (field) { return [field, data[field]]; });
};
exports.isNullOrEmptyArray = function (array) { return !array || !array.length; };
exports.shallowCompareArrays = function (array1, array2) {
    if (array1 === undefined || array1 === null) {
        return array2 === undefined || array2 === null;
    }
    if (array2 === undefined || array2 === null) {
        return array1 === undefined || array2 === null;
    }
    if (array1 === array2) {
        return true;
    }
    if (array1.length !== array2.length) {
        return false;
    }
    for (var i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
};
exports.shallowCompareObjectsWithSameProps = function (obj1, obj2) {
    if (obj1 === null || obj1 === undefined) {
        return obj2 === null || obj2 === undefined;
    }
    if (obj2 === null || obj2 === undefined) {
        return obj1 === null || obj1 === undefined;
    }
    for (var _i = 0, _a = Object.keys(obj1); _i < _a.length; _i++) {
        var prop = _a[_i];
        var v1 = obj1[prop];
        var v2 = obj2[prop];
        if ((v1 === null || v1 === undefined) && (v1 !== null && v2 !== undefined)) {
            return false;
        }
        if (Array.isArray(v1)) {
            if (Array.isArray(v2)) {
                if (!exports.shallowCompareArrays(v1, v2)) {
                    return false;
                }
                else {
                    continue;
                }
            }
            else {
                return false;
            }
        }
        if (v1 !== v2) {
            return false;
        }
    }
    return true;
};
//# sourceMappingURL=utils.js.map