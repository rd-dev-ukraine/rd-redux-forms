"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fields = {
    /**
     * A field which doesn't change a value received from the editor.
     * Usable if editor returns a data in the required format.
     */
    any: function () { return ({}); },
    float: function (digits, required, errorMessage) {
        if (digits === void 0) { digits = 2; }
        if (required === void 0) { required = true; }
        return ({
            parse: function (input) {
                if (input === void 0) { input = ""; }
                if (input === null || input === undefined || input === "") {
                    if (required) {
                        throw new Error(errorMessage || "Value is required.");
                    }
                    return null;
                }
                if (typeof input === "number") {
                    return input;
                }
                input = ("" + (input || "")).trim();
                var parsed = parseFloat(input);
                if (isNaN(parsed)) {
                    throw new Error(errorMessage || "Value is not a valid number");
                }
                return parsed;
            },
            formatForDisplay: function (value) {
                if (value === null || value === undefined) {
                    return "";
                }
                return value.toFixed(digits);
            }
        });
    },
    /** Binds a integer number to a text input. */
    int: function (required, errorMessage) {
        if (required === void 0) { required = true; }
        return ({
            formatForDisplay: function (value) {
                if (value === null || value === undefined) {
                    return "";
                }
                return value.toFixed(0);
            },
            parse: function (input) {
                if (input === void 0) { input = ""; }
                if (input === null || input === undefined || input === "") {
                    if (required) {
                        throw new Error(errorMessage || "Value is required.");
                    }
                    return null;
                }
                if (typeof input === "number") {
                    return input;
                }
                input = ("" + (input || "")).trim();
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
            formatForDisplay: function (value) { return value || ""; },
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