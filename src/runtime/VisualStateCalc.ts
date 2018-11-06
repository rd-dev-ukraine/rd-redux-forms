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
        isFormSubmitted: boolean,
        isParsed: boolean,
        hasCustomError: boolean,
        isFieldTouched: boolean,
        isFieldEditing: boolean
    ): FieldVisualState {
        if (!isParsed) {
            return isFieldEditing ? "none" : "invalid";
        } else {
            if (hasCustomError) {
                return isFieldTouched ? (isFieldEditing ? "none" : "valid") : "invalid";
            } else {
                return isFieldEditing ? "none" : isFieldTouched ? "valid" : "none";
            }
        }
    }
};
