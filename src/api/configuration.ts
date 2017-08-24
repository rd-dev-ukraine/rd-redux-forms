import { FormActions } from "./actions";
import { RdReduxFormEventsBindingFactory } from "./common";


export interface FormConfiguration<TFields, TMeta = undefined> {
    fields: FormFieldsConfiguration<TFields>;
    dispatch: RdReduxFormBindingFactory<TFields, TMeta>;
}

export type FormFieldsConfiguration<T> = {
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

export type ParserFn<T> = (input: any) => T | undefined;
export type FormatterFn<T> = (input: T | null | undefined) => any;

export type RdReduxFormBindingFactory<TFields, TMeta> = (config: FormConfiguration<TFields, TMeta>, actions: FormActions<TFields, TMeta>) => RdReduxFormEventsBindingFactory<TFields, TMeta>;
