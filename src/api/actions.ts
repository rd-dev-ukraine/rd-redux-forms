import { Action } from "redux";

import { FormErrors } from "./common";


/** TMeta is some custom metadata passed with each action but not saved in store. */
export interface FormActions<TFields, TMeta = undefined> {
    setData(data: Partial<TFields>, resetState?: boolean, meta?: TMeta): FormSetDataAction<TFields, TMeta>;
    fieldEdit(field: keyof TFields, value: any, meta?: TMeta): FieldEditAction<TFields, TMeta>;
    fieldFormat(field: keyof TFields, meta?: TMeta): FieldFormatAction<TFields, TMeta>;
    validate(meta?: TMeta): FormValidateAction<TMeta>;
    setErrors(errors?: FormErrors<TFields>, meta?: TMeta): FormSetErrorsAction<TFields, TMeta>;
    resetErrors(meta?: TMeta): FormSetErrorsAction<TFields, TMeta>;
    reset(meta?: TMeta): FormResetAction<TMeta>;

    /** Type guard which returns true if action is targeted this form. */
    isMyAction(action: Action): action is RdReduxFormActionBase<TMeta>;

    isSetData(action?: Action): action is FormSetDataAction<TFields, TMeta>;
    isFieldEdit(action?: Action): action is FieldEditAction<TFields, TMeta>;
    isFieldFormat(action?: Action): action is FieldFormatAction<TFields, TMeta>;
    isValidate(action?: Action): action is FormValidateAction<TMeta>;
    isReset(action?: Action): action is FormResetAction<TMeta>;
    isSetErrors(action?: Action): action is FormSetErrorsAction<TFields, TMeta>;
}

export interface RdReduxFormActionBase<TMeta = undefined> extends Action {
    form: string;
    meta: TMeta;
}

export interface FieldEditAction<TFields, TMeta = undefined> extends RdReduxFormActionBase<TMeta> {
    field: keyof TFields;
    value: any;
}

export interface FieldFormatAction<TFields, TMeta = undefined> extends RdReduxFormActionBase<TMeta> {
    field: keyof TFields;
}

export interface FormValidateAction<TMeta = undefined> extends RdReduxFormActionBase<TMeta> { }

export interface FormResetAction<TMeta = undefined> extends RdReduxFormActionBase<TMeta> { }

export interface FormSetDataAction<TFields, TMeta = undefined> extends RdReduxFormActionBase<TMeta> {
    data: Partial<TFields>;
    resetState: boolean;
}

export interface FormSetErrorsAction<TFields, TMeta = undefined> extends RdReduxFormActionBase<TMeta> {
    errors?: FormErrors<TFields>;
}