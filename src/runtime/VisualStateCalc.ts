import { FieldVisualState } from "../api/common";

export type CalculateVisualStateFn = (
    isFormValidated: boolean,
    isParsed: boolean,
    hasCustomError: boolean,
    isFieldTouched: boolean,
    isFieldEditing: boolean
) => FieldVisualState;

export const CalculateVisualStateStrategies = {
    default(
        isFormValidated: boolean,
        isParsed: boolean,
        hasCustomError: boolean,
        isFieldTouched: boolean,
        isFieldEditing: boolean
    ): FieldVisualState {
        // Doesn't mark field as valid or invalid while editing
        if (isFieldEditing) {
            return "none";
        }

        // If field is not parsed immediately mark field as invalid
        if (!isParsed) {
            return isFormValidated || isFieldTouched ? "invalid" : "none";
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
