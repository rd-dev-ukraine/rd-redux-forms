import { Action } from "redux";
import { FieldEditAction, FieldFormatAction, FormActions, FormErrors, FormResetAction, FormSetDataAction, FormSetErrorsAction, FormValidateAction, RdReduxFormActionBase } from "../api";
export declare class FormActionsImpl<TFields, TMeta = undefined> implements FormActions<TFields, TMeta> {
    private title;
    constructor(title: string);
    fieldEdit(field: keyof TFields, value: any, meta?: TMeta): FieldEditAction<TFields, TMeta>;
    fieldFormat(field: keyof TFields, meta?: TMeta): FieldFormatAction<TFields, TMeta>;
    setData(data: Partial<TFields>, resetState?: boolean, meta?: TMeta): FormSetDataAction<TFields, TMeta>;
    validate(meta?: TMeta): FormValidateAction<TMeta>;
    setErrors(errors?: FormErrors<TFields>, meta?: TMeta): FormSetErrorsAction<TFields, TMeta>;
    resetErrors(meta?: TMeta): FormSetErrorsAction<TFields, TMeta>;
    reset(meta?: TMeta): FormResetAction<TMeta>;
    isSetData(action?: Action): action is FormSetDataAction<TFields, TMeta>;
    isFieldEdit(action?: Action): action is FieldEditAction<TFields, TMeta>;
    isFieldFormat(action?: Action): action is FieldFormatAction<TFields, TMeta>;
    isValidate(action?: Action): action is FormValidateAction<TMeta>;
    isReset(action?: Action): action is FormResetAction<TMeta>;
    isSetErrors(action: Action): action is FormSetErrorsAction<TFields, TMeta>;
    isMyAction(action: Action): action is RdReduxFormActionBase<TMeta>;
    private makeActionType(action);
    private actionPrefix();
}
