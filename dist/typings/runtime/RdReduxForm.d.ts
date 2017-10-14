import { Action } from "redux";
import { FormActions, FormFieldsConfiguration, InvalidFormInfo, RdReduxForm, ReduxFormState, ValidFormInfo } from "../api";
export declare class RdReduxFormImpl<TFields, TMeta> implements RdReduxForm<TFields, TMeta> {
    private title;
    private fieldConfiguration;
    types: {
        readonly fields: TFields;
        readonly meta: TMeta;
        readonly state: ReduxFormState<TFields>;
    };
    fields: string[];
    actions: FormActions<TFields, TMeta>;
    state: {
        empty(): ReduxFormState<TFields>;
        withData(data: TFields): ReduxFormState<TFields>;
    };
    constructor(title: string, fieldConfiguration: FormFieldsConfiguration<TFields>);
    reducer<TState extends ReduxFormState<TFields>>(state: TState, action: Action): TState;
    selector(state: ReduxFormState<TFields>, ...initialData: Array<Partial<TFields>>): ValidFormInfo<TFields> | InvalidFormInfo<TFields>;
}
