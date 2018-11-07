import { Action } from "redux";
import { FormActions, FormFieldsConfiguration, InvalidFormInfo, RdReduxForm, ReduxFormState, ValidFormInfo } from "../api";
import { FormBindings } from "../bindings";
export declare class RdReduxFormImpl<TFields, TMeta> implements RdReduxForm<TFields, TMeta> {
    title: string;
    private fieldConfiguration;
    id: string;
    types: {
        readonly fields: TFields;
        readonly meta: TMeta;
        readonly state: ReduxFormState<TFields>;
        readonly eventBindings: FormBindings<TFields>;
        readonly selectorResult: ValidFormInfo<TFields> | InvalidFormInfo<TFields>;
    };
    fields: string[];
    actions: FormActions<TFields, TMeta>;
    state: {
        /**
         * Gets the state for the form without data.
         */
        empty(): ReduxFormState<TFields>;
        /**
         * Gets the state for the form with data.
         * Do the same thing as dispatching setData action with resetting, but can be used in reducer.
         */
        withData(data: TFields): ReduxFormState<TFields>;
    };
    constructor(title: string, fieldConfiguration: FormFieldsConfiguration<TFields>);
    reducer: <TState extends ReduxFormState<TFields>>(state: TState, action: Action<any>) => TState;
    selector: (state: ReduxFormState<TFields>, ...initialData: Partial<TFields>[]) => ValidFormInfo<TFields> | InvalidFormInfo<TFields>;
}
