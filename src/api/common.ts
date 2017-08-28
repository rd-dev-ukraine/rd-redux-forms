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
    fields: {[P in keyof T]: any };

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
    /** True since form is valid. */
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
    isValid: false;

    fields: {
        [P in keyof T]: FieldInfo;
    };

    formError?: string[];
}

export type FieldInfo = ValidFieldInfo | ParsedFieldWithCustomErrorInfo | NonParsedFieldInfo;

/**
 * Info about parsed field without custom errors.
 */
export interface ValidFieldInfo {
    /** True as value has been parsed successfully. */
    isParsed: true;

    /**
     * False since field is valid.
     */
    hasErrors: false;

    /**
     * Value to display in editor.
     */
    value: any;

    /**
     * Value formatted with formatting function.
     */
    formattedValue: any;

    parsedValue: any;

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

    /**
     * Value to display in editor.
     */
    value: any;

    parsedValue: any;

    /**
     * Value formatted with formatting function.
     */
    formattedValue: any;

    /**
     * A value indicates how field should be displayed on UI.
     */
    visualState: FieldVisualState;

    /**
     * An errors for the field.
     */
    errors: CustomFieldErrors;
}

/**
 * Field with parse error.
 */
export interface NonParsedFieldInfo {
    /** False since field is not parsed. */
    isParsed: false;

    hasErrors: true;

    /** Value of the field to display in input. */
    value: any;

    /**
     * Field errors.
     */
    errors: ParseFieldErrors | (ParseFieldErrors & CustomFieldErrors);

    /**
     * A value indicates how field should be displayed on UI.
     */
    visualState: FieldVisualState;
}

export interface FieldErrors {
    /** Array of combined custom and parse errors. */
    errors: string[];
}

export interface CustomFieldErrors extends FieldErrors {
    /** True if field has custom errors set. */
    hasCustomErrors: true;
    /**
     * Array of custom errors.
     */
    customErrors: string[];
}

export interface ParseFieldErrors extends FieldErrors {
    /** True if field has parse error. */
    hasParseError: true;
    /** A parse error. */
    parseError: string;
}

export type FieldVisualState = "none" | "valid" | "invalid";
