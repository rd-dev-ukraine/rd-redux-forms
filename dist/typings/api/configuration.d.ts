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
    parse?: (input: any) => T;
    /**
     * Validates parsed value.
     * Could throw exception to provide additional errors.
     *
     * This function would be called from selector if value were successfully parsed.
     */
    validate?: (value: T) => void;
    /**
     * Converts value for displaying in the editor if not in editing mode.
     * If not provided an input value will be used.
     *
     * Only successfully parsed value would be formatted for display.
     * Value is formatted in selector, state stores only raw used input.
     */
    formatForDisplay?: (input: T) => any;
    /**
     * Converts value stored in state to a format
     * convenient for editing.
     * If not provided the value would not be converted.
     *
     * This function is called either for valid and invalid input.
     */
    formatForEditing?: (value: any) => any;
}
