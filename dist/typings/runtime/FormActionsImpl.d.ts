import { Action } from "redux";
import { FieldEditAction, FieldEndEditingAction, FieldStartEditingAction, FormActions, FormErrors, FormResetAction, FormSetDataAction, FormSetErrorsAction, FormValidateAction, RdReduxFormActionBase, ResetFieldStateAction } from "../api";
export declare class FormActionsImpl<TFields, TMeta = undefined> implements FormActions<TFields, TMeta> {
    private title;
    constructor(title: string);
    fieldEdit: (field: keyof TFields, value: any, meta?: TMeta) => FieldEditAction<TFields, TMeta>;
    fieldStartEditing: (field: keyof TFields, meta?: TMeta) => FieldStartEditingAction<TFields, TMeta>;
    fieldEndEditing: (field: keyof TFields, meta?: TMeta) => FieldEndEditingAction<TFields, TMeta>;
    setData: (data: Partial<TFields>, resetState?: boolean, meta?: TMeta) => FormSetDataAction<TFields, TMeta>;
    /**
     * Sets the values for the selected fields and optionally resets state for provided fields only.
     */
    resetFieldState: (fields: (keyof TFields)[], meta?: TMeta) => ResetFieldStateAction<TFields, TMeta>;
    validate: (meta?: TMeta) => FormValidateAction<TMeta>;
    setErrors: (errors?: FormErrors<TFields> | undefined, meta?: TMeta) => FormSetErrorsAction<TFields, TMeta>;
    resetErrors: (meta?: TMeta) => FormSetErrorsAction<TFields, TMeta>;
    reset: (meta?: TMeta) => FormResetAction<TMeta>;
    isSetData: (action?: Action<any> | undefined) => action is FormSetDataAction<TFields, TMeta>;
    isResetFieldState: (action?: Action<any> | undefined) => action is ResetFieldStateAction<TFields, TMeta>;
    isFieldEdit: (action?: Action<any> | undefined) => action is FieldEditAction<TFields, TMeta>;
    isFieldStartEditing: (action?: Action<any> | undefined) => action is FieldStartEditingAction<TFields, TMeta>;
    isFieldEndEditing: (action?: Action<any> | undefined) => action is FieldEndEditingAction<TFields, TMeta>;
    isValidate: (action?: Action<any> | undefined) => action is FormValidateAction<TMeta>;
    isReset: (action?: Action<any> | undefined) => action is FormResetAction<TMeta>;
    isSetErrors: (action: Action<any>) => action is FormSetErrorsAction<TFields, TMeta>;
    isMyAction: (action: Action<any>) => action is RdReduxFormActionBase<TMeta>;
    private makeActionType;
    private actionPrefix;
    types: {
        FIELD_EDIT: string;
        FIELD_END_EDITING: string;
        FIELD_START_EDITING: string;
        RESET: string;
        SET_DATA: string;
        RESET_FIELD_STATE: string;
        SET_ERRORS: string;
        VALIDATE: string;
    };
}
