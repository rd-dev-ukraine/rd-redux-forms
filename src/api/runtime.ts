import { Action } from "redux";

import { FormBindings, BindingFactory } from "../bindings";
import { FormActions } from "./actions";
import { InvalidFormInfo, ReduxFormState, ValidFormInfo, FieldInfo } from "./common";

/**
 * rd-redux-forms object describes a form.
 */
export interface RdReduxForm<TFields, TMeta> {
    /** Form title specified on creation. */
    readonly title: string;

    /** Unique form instance id. */
    readonly id: string;

    /**
     * Method for creating form actions and checking action type.
     */
    actions: FormActions<TFields, TMeta>;

    /** An array of field names for the form. */
    fields: string[];

    /**
     * Reducer for the form actions.
     * Use it in combineReducers or in the place you put your reducers.
     */
    reducer: <TState extends ReduxFormState<TFields>>(state: TState, action: Action) => TState;

    /**
     * Parses user input, calculates status, field validity and visual state for current form state.
     * @param state Current form state.
     * @param initialData Values of fields for which there were no user input.
     * @returns An object contains all information about form input.
     */
    selector: (
        state: ReduxFormState<TFields>,
        ...initialData: Array<Partial<TFields>>
    ) => ValidFormInfo<TFields> | InvalidFormInfo<TFields>;

    /** Creates different form state. */
    state: {
        /**
         * Creates empty form state.
         * Use it instead of dispatching reset action.
         */
        empty(): ReduxFormState<TFields>;
        /**
         * Creates state for form with data.
         * Use it instead of dispatching setData action.
         */
        withData(data: Partial<TFields>): ReduxFormState<TFields>;
    };

    types: {
        fields: TFields;
        meta: TMeta;
        state: ReduxFormState<TFields>;
        selectorResult: ValidFormInfo<TFields> | InvalidFormInfo<TFields>;
        eventBindings: FormBindings<TFields>;
    };

    createInstance(bindings: BindingFactory<TFields, TMeta>): RdReduxDetachedForm<TFields>;
}

export interface RdReduxDetachedForm<TFields> {}

export type DetachedFormFields<TFields> = {
    [TField in keyof TFields]: FieldInfo & {
        props: any;
    };
};
