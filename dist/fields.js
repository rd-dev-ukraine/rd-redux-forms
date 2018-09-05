"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fields = {
    /**
     * A field which doesn't change a value received from the editor.
     * Usable if editor returns a data in the required format.
     */
    any: function () { return ({
        formatter: function (input) { return input; },
        parser: function (input) { return input; }
    }); },
    float: function (digits, required, errorMessage) {
        if (digits === void 0) { digits = 2; }
        if (required === void 0) { required = true; }
        return ({
            parser: exports.fields.int(required, errorMessage).parser,
            formatter: function (input) {
                if (input === null || input === undefined) {
                    return "";
                }
                return input.toFixed(digits);
            }
        });
    },
    /** Binds a integer number to a text input. */
    int: function (required, errorMessage) {
        if (required === void 0) { required = true; }
        return ({
            parser: function (input) {
                if (input === void 0) { input = ""; }
                input = ("" + (input || "")).trim();
                if (!input) {
                    if (required) {
                        throw new Error(errorMessage || "Value is required.");
                    }
                    return null;
                }
                var parsed = parseInt(input, 10);
                if (isNaN(parsed)) {
                    throw new Error(errorMessage || "Value is not a valid number");
                }
                return parsed;
            },
            formatter: function (input) {
                if (input === undefined || input === null) {
                    return "";
                }
                return input.toFixed(0);
            }
        });
    },
    string: function (required, errorMessage) {
        if (required === void 0) { required = true; }
        return ({
            parser: function (input) {
                if (input === void 0) { input = ""; }
                input = input || "";
                if (!input.trim() && required) {
                    throw new Error(errorMessage || "Value is required");
                }
                return input;
            },
            formatter: function (input) { return input || ""; }
        });
    }
};
//# sourceMappingURL=fields.js.map