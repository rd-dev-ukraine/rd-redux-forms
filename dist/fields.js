"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fields = {
    any: function () { return ({
        formatter: function (input) { return input; },
        parser: function (input) { return input === undefined ? null : input; }
    }); },
    float: function (digits, required) {
        if (digits === void 0) { digits = 2; }
        if (required === void 0) { required = true; }
        return ({
            parser: exports.fields.int(required).parser,
            formatter: function (input) {
                if (input === null || input === undefined) {
                    return "";
                }
                return input.toFixed(digits);
            }
        });
    },
    int: function (required) {
        if (required === void 0) { required = true; }
        return ({
            parser: function (input) {
                if (input === void 0) { input = ""; }
                input = input.trim();
                if (!input) {
                    return required ? undefined : 0;
                }
                var parsed = parseInt(input, 10);
                return isNaN(parsed) ? undefined : parsed;
            },
            formatter: function (input) {
                if (input === undefined) {
                    return "";
                }
                return input.toFixed(0);
            }
        });
    },
    string: function (required) {
        if (required === void 0) { required = true; }
        return ({
            parser: function (input) {
                if (input === void 0) { input = ""; }
                input = input.trim();
                if (!input) {
                    return required ? undefined : "";
                }
                return input;
            },
            formatter: function (input) { return (input || "").trim(); },
        });
    }
};
//# sourceMappingURL=fields.js.map