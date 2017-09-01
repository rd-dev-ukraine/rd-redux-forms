import { Action } from "redux";

import { FormErrors } from "./common";

/** TMeta is some custom metadata passed with each action but not saved in store. */
export interface FormActions<TFields, TMeta = undefined> {
    types: {
        SET_DATA: string;
        FIELD_EDIT: string;
        FIELD_FORMAT: string;
        FIELD_UNFORMAT: string;
        VALIDATE: string;
        SET_ERRORS: string;
        RESET: string;
    };

    /**
     * Sets the values for the fields,
     * optionally resets form to an initial state (ie reset all edit/formatted flags on fields).
     */
    setData(data: Partial<TFields>, resetState?: boolean, meta?: TMeta): FormSetDataAction<TFields, TMeta>;

    /**
     * Sets the value to the field.
     */
    fieldEdit(field: keyof TFields, value: any, meta?: TMeta): FieldEditAction<TFields, TMeta>;

    /**
     * Formats a value for the field using field formatting function.
     */
    fieldFormat(field: keyof TFields, meta?: TMeta): FieldFormatAction<TFields, TMeta>;

    /**
     * Prepares an input for editing by optionally replacing a value with another more convenient for editing.
     */
    fieldUnformat(field: keyof TFields, meta?: TMeta): FieldUnformatAction<TFields, TMeta>;

    /**
     * Initiates form saving process.
     * Usually should be called on form submit.
     *
     * Note this action only sets validated flag and resets field status.
     * It should be handled by you and perform saving or other action if form is valid.
     */
    validate(meta?: TMeta): FormValidateAction<TMeta>;

    /**
     * Sets additional errors to the form.
     * Additional errors could be retrieved from server or
     * obtained by custom validation process
     * since library provides no built-in value validation.
     */
    setErrors(errors?: FormErrors<TFields>, meta?: TMeta): FormSetErrorsAction<TFields, TMeta>;

    /**
     * Removes custom validation errors. Same as  setErrors(undefined, meta).
     */
    resetErrors(meta?: TMeta): FormSetErrorsAction<TFields, TMeta>;

    /**
     * Resets form to it's initial state, removes errors and field statuses.
     */
    reset(meta?: TMeta): FormResetAction<TMeta>;

    /** Type guard which returns true if action is targeted this form. */
    isMyAction(action: Action): action is RdReduxFormActionBase<TMeta>;

    /**
     * Checks if action is set data action.
     */
    isSetData(action?: Action): action is FormSetDataAction<TFields, TMeta>;

    /**
     * Checks if action is field edit action.
     */
    isFieldEdit(action?: Action): action is FieldEditAction<TFields, TMeta>;

    /**
     * Checks if action is field formatting action.
     */
    isFieldFormat(action?: Action): action is FieldFormatAction<TFields, TMeta>;

    /**
     * Checks if action is field un-formatting action.
     */
    isFieldUnformat(action?: Action): action is FieldUnformatAction<TFields, TMeta>;

    /**
     * Checks if action is form validation action.
     */
    isValidate(action?: Action): action is FormValidateAction<TMeta>;

    /**
     * Checks if action is form reset action.
     */
    isReset(action?: Action): action is FormResetAction<TMeta>;

    /**
     * Checks if action is set errors action.
     */
    isSetErrors(action?: Action): action is FormSetErrorsAction<TFields, TMeta>;
}

/**
 * Base fields for all rd-redux-form actions.
 */
export interface RdReduxFormActionBase<TMeta> extends Action {
    /** Name of the form. */
    form: string;
    /** Additional action parameter with custom info. */
    meta: TMeta;
}

export interface FieldEditAction<TFields, TMeta = undefined> extends RdReduxFormActionBase<TMeta> {
    field: keyof TFields;
    value: any;
}

export interface FieldFormatAction<TFields, TMeta = undefined> extends RdReduxFormActionBase<TMeta> {
    field: keyof TFields;
}

export interface FieldUnformatAction<TFields, TMeta = undefined> extends RdReduxFormActionBase<TMeta> {
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
