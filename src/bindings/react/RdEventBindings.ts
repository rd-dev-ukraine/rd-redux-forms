import * as React from "react";

/**
 * Result of the event bindings for the RdReduxForm.
 */
export interface RdEventBindings<TFields> {
    form: FormEventBindings;
    fields: { [Field in keyof TFields]: FieldEventBindings };
}

/**
 * Object contains a event handlers and property values for React <form> element.
 */
export interface FormEventBindings {
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    [eventOrProp: string]: any;
}

export type FieldEventBindings = InputFieldEventBindings | DirectValueEventBindings;

export interface DirectValueEventBindings {
    onChange?: (value: any) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

export interface InputFieldEventBindings {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}
