import * as React from "react";

/**
 * Contains event handlers for form and inputs.
 */
export interface RdReduxFormBindings<TFields> {
    form: FormElementBindings;
    fields: { [Field in keyof TFields]: FieldBindings };
}

/**
 * Object contains a event handlers and property values for React <form> element.
 */
export interface FormElementBindings {
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    [eventOrProp: string]: any;
}

export type FieldBindings = InputFieldBindings | DirectValueBindings;

export interface DirectValueBindings {
    onChange?: (value: any) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

export interface InputFieldBindings {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}
