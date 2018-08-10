import { Action } from "redux";
import { FieldEditAction, FieldFormatAction, FieldUnformatAction, FormActions, FormErrors, FormResetAction, FormSetDataAction, FormSetErrorsAction, FormValidateAction, RdReduxFormActionBase } from "../api";
export declare class FormActionsImpl<TFields, TMeta = undefined> implements FormActions<TFields, TMeta> {
    private title;
    types: {
        FIELD_EDIT: string;
        FIELD_FORMAT: string;
        FIELD_UNFORMAT: string;
        RESET: string;
        SET_DATA: string;
        SET_ERRORS: string;
        VALIDATE: string;
    };
    constructor(title: string);
    fieldEdit(field: keyof TFields, value: any, meta?: TMeta): FieldEditAction<TFields, TMeta>;
    fieldFormat(field: keyof TFields, meta?: TMeta): FieldFormatAction<TFields, TMeta>;
    fieldUnformat(field: keyof TFields, meta?: TMeta): FieldUnformatAction<TFields, TMeta>;
    setData(data: Partial<TFields>, resetState?: boolean, meta?: TMeta): FormSetDataAction<TFields, TMeta>;
    validate(meta?: TMeta): FormValidateAction<TMeta>;
    setErrors(errors?: FormErrors<TFields>, meta?: TMeta): FormSetErrorsAction<TFields, TMeta>;
    resetErrors(meta?: TMeta): FormSetErrorsAction<TFields, TMeta>;
    reset(meta?: TMeta): FormResetAction<TMeta>;
    isSetData(action?: Action): action is FormSetDataAction<TFields, TMeta>;
    isFieldEdit(action?: Action): action is FieldEditAction<TFields, TMeta>;
    isFieldFormat(action?: Action): action is FieldFormatAction<TFields, TMeta>;
    isFieldUnformat(action?: Action): action is FieldUnformatAction<TFields, TMeta>;
    isValidate(action?: Action): action is FormValidateAction<TMeta>;
    isReset(action?: Action): action is FormResetAction<TMeta>;
    isSetErrors(action: Action): action is FormSetErrorsAction<TFields, TMeta>;
    isMyAction(action: Action): action is RdReduxFormActionBase<TMeta>;
    private makeActionType;
    private actionPrefix;
}
