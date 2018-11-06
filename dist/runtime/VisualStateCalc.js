"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateVisualStateStrategies = {
    default: function (isFormSubmitted, isParsed, hasCustomError, isFieldTouched, isFieldEditing) {
        if (!isParsed) {
            return isFieldEditing ? "none" : "invalid";
        }
        else {
            if (hasCustomError) {
                return isFieldTouched ? (isFieldEditing ? "none" : "valid") : "invalid";
            }
            else {
                return isFieldEditing ? "none" : isFieldTouched ? "valid" : "none";
            }
        }
    }
};
//# sourceMappingURL=VisualStateCalc.js.map