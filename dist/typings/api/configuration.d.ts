export declare type FormFieldsConfiguration<T> = {
    [K in keyof T]: FieldConfiguration<T[K]>;
};
/** Form field configuration. */
export interface FieldConfiguration<T> {
    /**
     * Converts a value received from the editor
     * to a format required by the form data.
     *
     * Function must throw an exception if value can't be converted from the editor format.
     * Exception message would be an error message for a field.
     */
    parser?: (input: any) => T;
    /**
     * Converts a value from the form data to a format
     * required by the editor.
     *
     * Only parsed value would be formatted.
     *
     * Must not throw an exception.
     */
    formatter?: (data: T) => any;
    /**
     * Converts current value to a form appropriate for editing.
     * This function is optional and would be used
     * when user starts editing a value.
     *
     * Only parsed value would be unformatted.
     *
     * It can for example remove number formatting
     * (thousands separators, trailing and leading zeros etc.)
     *
     */
    unformatter?: (input: T) => any;
}
