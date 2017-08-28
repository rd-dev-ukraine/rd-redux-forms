export interface FormConfiguration<TFields, TMeta> {
    fields: FormFieldsConfiguration<TFields>;
}
export declare type FormFieldsConfiguration<T> = {
    [K in keyof T]: FieldConfiguration<T[K] | null>;
};
/** Form field configuration. */
export interface FieldConfiguration<T> {
    /** Optional function which converts a value from a string received from input.  */
    parser?: ParserFn<T>;
    /** Optional function which converts a value for displaying. */
    formatter?: FormatterFn<T>;
    /** String displayed if value parsed with error. */
    parseError?: string;
}
export declare type ParserFn<T> = (input: any) => T | undefined;
export declare type FormatterFn<T> = (input: T | null | undefined) => any;
