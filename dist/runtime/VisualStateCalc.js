"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateVisualStateStrategies = {
    default: function (isFormValidated, isParsed, hasCustomError, isFieldTouched, isFieldEditing) {
        // Doesn't mark field as valid or invalid while editing
        if (isFieldEditing) {
            return "none";
        }
        // If field is not parsed immediately mark field as invalid
        if (!isParsed) {
            return "invalid";
        }
        // If field has custom error,
        // mark field as invalid if field is not touched yet.
        // If field is touched mark it as undefined to don't confuse user with valid state.
        if (hasCustomError) {
            return isFieldTouched ? "none" : "invalid";
        }
        return isFieldTouched ? "none" : isFormValidated ? "valid" : "none";
    }
};
//# sourceMappingURL=VisualStateCalc.js.map