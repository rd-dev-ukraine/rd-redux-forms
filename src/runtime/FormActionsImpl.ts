import { Action } from "redux";
import {
    FieldEditAction,
    FieldEndEditingAction,
    FieldStartEditingAction,
    FormActions,
    FormErrors,
    FormResetAction,
    FormSetDataAction,
    FormSetErrorsAction,
    FormValidateAction,
    RdReduxFormActionBase,
    ResetFieldStateAction
} from "../api";

export class FormActionsImpl<TFields, TMeta = undefined> implements FormActions<TFields, TMeta> {
    constructor(private title: string) {}

    fieldEdit = (field: keyof TFields, value: any, meta: TMeta = undefined as any): FieldEditAction<TFields, TMeta> => {
        if (!field) {
            throw new Error("Field is not defined.");
        }

        return { field, form: this.title, meta, type: this.types.FIELD_EDIT, value };
    };

    fieldStartEditing = (
        field: keyof TFields,
        meta: TMeta = undefined as any
    ): FieldStartEditingAction<TFields, TMeta> => {
        if (!field) {
            throw new Error("Field is not defined.");
        }

        return { field, form: this.title, meta, type: this.types.FIELD_START_EDITING };
    };

    fieldEndEditing = (field: keyof TFields, meta: TMeta = undefined as any): FieldEndEditingAction<TFields, TMeta> => {
        if (!field) {
            throw new Error("Field is not defined.");
        }

        return { field, form: this.title, meta, type: this.types.FIELD_END_EDITING };
    };

    setData = (
        data: Partial<TFields>,
        resetState: boolean = false,
        meta: TMeta = undefined as any,
        mergeData: boolean = false
    ): FormSetDataAction<TFields, TMeta> => {
        if (!data) {
            throw new Error("Data is not defined.");
        }

        return { data, form: this.title, meta, resetState, type: this.types.SET_DATA, mergeData: mergeData || false };
    };

    /**
     * Sets the values for the selected fields and optionally resets state for provided fields only.
     */
    resetFieldState = (
        fields: Array<keyof TFields>,
        meta: TMeta = undefined as any
    ): ResetFieldStateAction<TFields, TMeta> => {
        return {
            fields,
            form: this.title,
            meta,
            type: this.types.RESET_FIELD_STATE
        };
    };

    validate = (meta: TMeta = undefined as any): FormValidateAction<TMeta> => {
        return { form: this.title, meta, type: this.types.VALIDATE };
    };

    setErrors = (errors?: FormErrors<TFields>, meta: TMeta = undefined as any): FormSetErrorsAction<TFields, TMeta> => {
        return { errors, form: this.title, meta, type: this.types.SET_ERRORS };
    };

    resetErrors = (meta: TMeta = undefined as any): FormSetErrorsAction<TFields, TMeta> => {
        return this.setErrors(undefined, meta);
    };

    reset = (meta: TMeta = undefined as any): FormResetAction<TMeta> => {
        return { form: this.title, meta, type: this.types.RESET };
    };

    isSetData = (action?: Action): action is FormSetDataAction<TFields, TMeta> => {
        return !!action && action.type === this.types.SET_DATA;
    };

    isResetFieldState = (action?: Action): action is ResetFieldStateAction<TFields, TMeta> => {
        return !!action && action.type === this.types.RESET_FIELD_STATE;
    };

    isFieldEdit = (action?: Action): action is FieldEditAction<TFields, TMeta> => {
        return !!action && action.type === this.types.FIELD_EDIT;
    };

    isFieldStartEditing = (action?: Action): action is FieldStartEditingAction<TFields, TMeta> => {
        return !!action && action.type === this.types.FIELD_START_EDITING;
    };

    isFieldEndEditing = (action?: Action): action is FieldEndEditingAction<TFields, TMeta> => {
        return !!action && action.type === this.types.FIELD_END_EDITING;
    };

    isValidate = (action?: Action): action is FormValidateAction<TMeta> => {
        return !!action && action.type === this.types.VALIDATE;
    };

    isReset = (action?: Action): action is FormResetAction<TMeta> => {
        return !!action && action.type === this.types.RESET;
    };

    isSetErrors = (action: Action): action is FormSetErrorsAction<TFields, TMeta> => {
        return !!action && action.type === this.types.SET_ERRORS;
    };

    isMyAction = (action: Action): action is RdReduxFormActionBase<TMeta> => {
        if (action && `${action.type}`.indexOf(this.actionPrefix()) === 0) {
            return (action as RdReduxFormActionBase<TMeta>).form === this.title;
        }

        return false;
    };
    private makeActionType = (action: string): string => {
        if (!action) {
            throw new Error("Action is not defined.");
        }

        return `${this.actionPrefix()} ${action.toLowerCase()}`;
    };

    private actionPrefix = (): string => {
        return `RD-FORM :: ${this.title} ::`;
    };

    // tslint:disable-next-line:member-ordering
    types = {
        FIELD_EDIT: this.makeActionType("EDIT_FIELD"),
        FIELD_END_EDITING: this.makeActionType("END_FIELD_EDITING"),
        FIELD_START_EDITING: this.makeActionType("START_FIELD_EDITING"),
        RESET: this.makeActionType("RESET"),
        SET_DATA: this.makeActionType("SET_DATA"),
        RESET_FIELD_STATE: this.makeActionType("RESET_FIELD_STATE"),
        SET_ERRORS: this.makeActionType("SET_ERRORS"),
        VALIDATE: this.makeActionType("VALIDATE")
    };
}
