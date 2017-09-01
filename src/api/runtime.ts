import { Action } from "redux";

import { FormActions } from "./actions";
import { InvalidFormInfo, ReduxFormState, ValidFormInfo } from "./common";

/**
 * rd-redux-forms object describes a form.
 */
export interface RdReduxForm<TFields, TMeta> {
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
    selector: (state: ReduxFormState<TFields>, ...initialData: Array<Partial<TFields>>) =>
        ValidFormInfo<TFields> | InvalidFormInfo<TFields>;

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
        withData(data: TFields): ReduxFormState<TFields>;
    };

    types: {
        fields: TFields;
        meta: TMeta;
    };
}
