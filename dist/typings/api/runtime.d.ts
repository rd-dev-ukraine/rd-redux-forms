import { Action } from "redux";
import { FormActions } from "./actions";
import { FormSelectorResult, RdReduxFormConnect, RdReduxFormState } from "./common";
export interface RdReduxForm<TFields, TMeta = undefined> {
    actions: FormActions<TFields, TMeta>;
    reducer: <TState extends RdReduxFormState<TFields>>(state: TState, action: Action) => TState;
    /**
     * Parses user input, calculates status, field validity and visual state for current form state.
     * @param state Current form state.
     * @param initialData Values of fields for which there were no user input.
     * @returns An object contains all information about form input.
     */
    selector: (state: RdReduxFormState<TFields>, ...initialData: Array<Partial<TFields>>) => FormSelectorResult<TFields>;
    connect: RdReduxFormConnect<TFields, TMeta>;
    state: {
        empty(): RdReduxFormState<TFields>;
        withData(data: TFields): RdReduxFormState<TFields>;
    };
}
