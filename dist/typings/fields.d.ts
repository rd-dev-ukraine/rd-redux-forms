import { FieldConfiguration } from "./api";
export declare const fields: {
    /**
     * A field which doesn't change a value received from the editor.
     * Usable if editor returns a data in the required format.
     */
    any: <T>() => FieldConfiguration<T>;
    float: (digits?: number, required?: boolean, errorMessage?: string | undefined) => FieldConfiguration<number | null>;
    /** Binds a integer number to a text input. */
    int: (required?: boolean, errorMessage?: string | undefined) => FieldConfiguration<number | null>;
    string: (required?: boolean, errorMessage?: string | undefined) => FieldConfiguration<string | null>;
};
