import { Dispatch } from "redux";

export interface FormErrors<T> {
    message?: string[];

    fields?: {
        [P in keyof T]?: string[];
    };
}

export interface RdReduxFormState<T> {
    fields: {[P in keyof T]: any };

    /** All fields were changed since last validation or reset. */
    touched: Set<string>;

    /** All fields were formatted since last validation or reset. */
    formatted: Set<string>;

    validated: boolean;

    /** Optional external errors. */
    errors?: FormErrors<T>;
}

export interface FormSelectorResult<T> {
    fields: {
        [P in keyof T]: FieldSelectorResult;
    };

    isValid: boolean;
    data?: T;

    formError?: string[];
}

export interface FieldSelectorResult {
    /** Value to display in input. */
    value: string;

    /** True if value was successfully parsed, false otherwise. */
    isParsed: boolean;

    /** Parsed value. If value can't be parsed would be undefined. */
    parsedValue?: any;

    /**
     * Formatted value. Defined only if value was successfully parsed.
     * Avoid displaying this value in input,
     * value in the 'value' field will be automatically formatted at specified conditions.
     */
    formattedValue?: string;

    errors?: string[];

    visualState: FieldVisualState;
}

export type FieldVisualState = "none" | "valid" | "invalid";

export type RdReduxFormEventsBindingFactory<TFields, TMeta = undefined> =
    (dispatch: Dispatch<any>, meta?: TMeta) => RdReduxFormEvents<TFields>;

export interface RdReduxFormEvents<TFields> {
    $events: {
        form: any;
        fields: {
            [F in keyof TFields]: any;
        }
    };
}

export interface RdReduxFormConnect<TFields, TMeta = undefined> {
    stateToFields: (state: RdReduxFormState<TFields>) => FormSelectorResult<TFields>;
    dispatch: RdReduxFormEventsBindingFactory<TFields, TMeta>;
}
