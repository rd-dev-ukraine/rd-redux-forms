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
     * Must not throw an exception.
     */
    formatter?: (data: T) => any;
}
