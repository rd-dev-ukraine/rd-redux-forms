export type FormFieldsConfiguration<T> = { [K in keyof T]: FieldConfiguration<T[K]> };

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

    toDisplay?: (info: FieldValueInfo<T>) => any;
}

export interface FieldValueInfo<T> {
    /** Input from the editor. */
    input: any;

    /** Parser result (if value were parsed) */
    parsedValue?: T;

    /** Indicates if user is in editing process */
    isEditing: boolean;

    /** Indicates whether field were edited. */
    isTouched: boolean;

    /** Indicates if value were parsed. */
    isParsed: boolean;
}
