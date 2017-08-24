import { Action } from "redux";
import { FormActions, FormConfiguration, FormSelectorResult, RdReduxForm, RdReduxFormConnect, RdReduxFormState } from "../api";
export declare type FieldTypedHash<T, F> = {
    [P in keyof T]: F;
};
export declare class RdReduxFormImpl<TFields, TMeta = undefined> implements RdReduxForm<TFields, TMeta> {
    private title;
    private config;
    actions: FormActions<TFields, TMeta>;
    connect: RdReduxFormConnect<TFields, TMeta>;
    state: {
        empty(): RdReduxFormState<TFields>;
        withData(data: TFields): RdReduxFormState<TFields>;
    };
    constructor(title: string, config: FormConfiguration<TFields, TMeta>);
    reducer<TState extends RdReduxFormState<TFields>>(state: TState, action: Action): TState;
    selector(state: RdReduxFormState<TFields>, ...initialData: Array<Partial<TFields>>): FormSelectorResult<TFields>;
    private createConnect();
}
