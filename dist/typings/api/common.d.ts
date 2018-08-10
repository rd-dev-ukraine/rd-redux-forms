/**
 * Errors for the field and for the form itself.
 */
export interface FormErrors<T> {
    /**
     * Form errors.
     */
    message?: string[];
    /** Fields errors */
    fields?: {
        [P in keyof T]?: string[];
    };
}
/**
 * App state for the one form.
 */
export interface ReduxFormState<T> {
    /** Field values. */
    fields: {
        [P in keyof T]: any;
    };
    /** All fields were changed since last validation or reset. */
    touched: Set<string>;
    /** All fields were formatted since last validation or reset. */
    formatted: Set<string>;
    /**
     * True if form tried to validate.
     */
    validated: boolean;
    /** Optional external errors. */
    errors?: FormErrors<T>;
}
/**
 * Detailed info about form without errors.
 */
export interface ValidFormInfo<T> {
    /** True if form is valid. */
    isValid: true;
    fields: {
        [P in keyof T]: ValidFieldInfo;
    };
    /**
     * Parsed form data.
     */
    data: T;
}
export interface InvalidFormInfo<T> {
    /** False for invalid form. */
    isValid: false;
    /** Indicates whether all fields of the form were parsed successfully. */
    isParsed: boolean;
    fields: {
        [P in keyof T]: FieldInfo;
    };
    formError?: string[];
}
export declare type FieldInfo = ValidFieldInfo | ParsedFieldWithCustomErrorInfo | NonParsedFieldInfo;
/**
 * Info about parsed field without custom errors.
 */
export interface ValidFieldInfo {
    /** True as value has been parsed successfully. */
    isParsed: true;
    /**
     * False if field is not valid: not parsed or has custom error set in state.
     */
    hasErrors: false;
    /** Field value that used as form data. Correctly parsed and validated. */
    data: any;
    /**
     * Value to display in editor.
     * Converted to editor's data type.
     */
    value: any;
    /**
     * A value indicates how field should be displayed on UI.
     */
    visualState: FieldVisualState;
}
/**
 * Info about parsed field but with custom errors.
 */
export interface ParsedFieldWithCustomErrorInfo {
    /** True as value has been parsed successfully. */
    isParsed: true;
    /**
     * False since field is valid.
     */
    hasErrors: true;
    /** Field value that used as form data. Correctly parsed and validated. */
    data: any;
    /**
     * Value to display in editor.
     * Converted to editor's data type.
     */
    value: any;
    /**
     * A value indicates how field should be displayed on UI.
     */
    visualState: FieldVisualState;
    /**
     * An errors for the field.
     */
    errors: string[];
}
/**
 * Field with parse error.
 */
export interface NonParsedFieldInfo {
    /** False since field is not parsed. */
    isParsed: false;
    hasErrors: true;
    /**
     * Value to display in editor.
     * Converted to editor's data type.
     */
    value: any;
    /**
     * Field errors.
     */
    errors: string[];
    /**
     * A value indicates how field should be displayed on UI.
     */
    visualState: FieldVisualState;
}
export declare type FieldVisualState = "none" | "valid" | "invalid";
