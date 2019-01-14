"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fields = {
    /**
     * A field which doesn't change a value received from the editor.
     * Usable if editor returns a data in the required format.
     */
    any: function () { return ({
        parse: function (input) { return input; },
        toDisplay: function (info) { return info.input; }
    }); },
    float: function (digits, required, errorMessage) {
        if (digits === void 0) { digits = 2; }
        if (required === void 0) { required = true; }
        return ({
            parse: function (input) {
                if (input === void 0) { input = ""; }
                input = ("" + (input || "")).trim();
                if (!input) {
                    if (required) {
                        throw new Error(errorMessage || "Value is required.");
                    }
                    return null;
                }
                var parsed = parseFloat(input);
                if (isNaN(parsed)) {
                    throw new Error(errorMessage || "Value is not a valid number");
                }
                return parsed;
            },
            toDisplay: function (info) {
                if (!info.isParsed) {
                    return info.input;
                }
                if (info.parsedValue === null || info.parsedValue === undefined) {
                    return "";
                }
                return info.parsedValue.toFixed(digits);
            }
        });
    },
    /** Binds a integer number to a text input. */
    int: function (required, errorMessage) {
        if (required === void 0) { required = true; }
        return ({
            toDisplay: function (info) {
                if (!info.isParsed) {
                    return info.input;
                }
                if (info.parsedValue === null || info.parsedValue === undefined) {
                    return "";
                }
                return info.parsedValue.toFixed(0);
            },
            parse: function (input) {
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
            }
        });
    },
    string: function (required, errorMessage) {
        if (required === void 0) { required = true; }
        return ({
            toDisplay: function (info) { return info.input || ""; },
            parse: function (input) {
                if (input === void 0) { input = ""; }
                input = input || "";
                if (!input.trim() && required) {
                    throw new Error(errorMessage || "Value is required");
                }
                return input;
            }
        });
    }
};
//# sourceMappingURL=fields.js.map