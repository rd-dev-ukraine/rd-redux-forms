import { FieldVisualState } from "../api/common";
export declare type CalculateVisualStateFn = (isFormValidated: boolean, isParsed: boolean, hasCustomError: boolean, isFieldTouched: boolean, isFieldEditing: boolean) => FieldVisualState;
export declare const CalculateVisualStateStrategies: {
    default(isFormSubmitted: boolean, isParsed: boolean, hasCustomError: boolean, isFieldTouched: boolean, isFieldEditing: boolean): FieldVisualState;
};
