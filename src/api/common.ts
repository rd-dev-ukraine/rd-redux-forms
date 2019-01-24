/**
 * Errors for the field and for the form itself.
 */
export interface FormErrors<T> {
    /**
     * Form errors.
     */
    message?: string[];

    /** Fields errors */
    fields?: { [P in keyof T]?: string[] };
}

/**
 * App state for the one form.
 */
export interface ReduxFormState<TFields> {
    /** Field values. */
    fields: { [P in keyof TFields]?: any };

    /** All fields were changed since last validation or reset. */
    touched: { [P in keyof TFields]?: any };

    /** All fields were formatted since last validation or reset. */
    editing: { [P in keyof TFields]?: "unchanged" | "changed" };

    /**
     * True if form tried to validate.
     */
    validated: boolean;

    /** Optional external errors. */
    errors?: FormErrors<TFields>;

    selectorResultCache?: ValidFormInfo<TFields> | InvalidFormInfo<TFields>;
}

export interface FormInfo<T> {
    /**
     * Indicates whether an object with data could be built from the form.
     * It is true if all fields are correctly parsed, false otherwise.
     * The custom errors doesn't affect this value.
     */
    isValid: boolean;

    /**
     * Indicates whether custom errors were set for the form.
     */
    hasCustomErrors: boolean;

    /** Field detailed info. */
    fields: { [P in keyof T]: FieldInfo };
}

/**
 * Detailed info about form without errors.
 */
export interface ValidFormInfo<T> extends FormInfo<T> {
    isValid: true;

    fields: { [P in keyof T]: ValidFieldInfo };

    /**
     * Parsed form data.
     */
    data: T;
}

export interface InvalidFormInfo<T> extends FormInfo<T> {
    isValid: false;

    /** Error for the whole form set with the custom errors. */
    customFormError?: string[];
}

export type FieldInfo = ValidFieldInfo | ParsedFieldWithCustomErrorInfo | NonParsedFieldInfo;

/**
 * Info about parsed field without custom errors.
 */
export interface ValidFieldInfo {
    /** True as value has been parsed successfully. */
    isParsed: true;

    /**
     * Indicates whether custom errors has been set for the field.
     */
    hasCustomErrors: false;

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
    hasCustomErrors: true;

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

    hasCustomErrors: boolean;

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

export type FieldVisualState = "none" | "valid" | "invalid";
