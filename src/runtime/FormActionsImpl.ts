import { Action } from "redux";
import {
    FieldEditAction,
    FieldFormatAction,
    FormActions,
    FormErrors,
    FormResetAction,
    FormSetDataAction,
    FormSetErrorsAction,
    FormValidateAction,
    RdReduxFormActionBase
} from "../api";

export class FormActionsImpl<TFields, TMeta = undefined> implements FormActions<TFields, TMeta> {
    types = {
        FIELD_EDIT: this.makeActionType("EDIT_FIELD"),
        FIELD_FORMAT: this.makeActionType("FORMAT_FIELD"),
        RESET: this.makeActionType("RESET"),
        SET_DATA: this.makeActionType("SET_DATA"),
        SET_ERRORS: this.makeActionType("SET_ERRORS"),
        UNFORMAT: this.makeActionType("UNFORMAT"),
        VALIDATE: this.makeActionType("VALIDATE"),
    } ;

    constructor(private title: string) { }

    fieldEdit(field: keyof TFields, value: any, meta: TMeta = undefined as any): FieldEditAction<TFields, TMeta> {
        if (!field) {
            throw new Error("Field is not defined.");
        }

        return {
            field,
            form: this.title,
            meta,
            type: this.types.FIELD_EDIT,
            value,
        };
    }

    fieldFormat(field: keyof TFields, meta: TMeta = undefined as any): FieldFormatAction<TFields, TMeta> {
        if (!field) {
            throw new Error("Field is not defined.");
        }

        return {
            field,
            form: this.title,
            meta,
            type: this.types.FIELD_FORMAT,
        };
    }

    setData(
        data: Partial<TFields>,
        resetState: boolean = false,
        meta: TMeta = undefined as any): FormSetDataAction<TFields, TMeta> {
        if (!data) {
            throw new Error("Data is not defined.");
        }

        return {
            data,
            form: this.title,
            meta,
            resetState,
            type: this.types.SET_DATA
        };
    }

    validate(meta: TMeta = undefined as any): FormValidateAction<TMeta> {
        return {
            form: this.title,
            meta,
            type: this.types.VALIDATE
        };
    }

    setErrors(errors?: FormErrors<TFields>, meta: TMeta = undefined as any): FormSetErrorsAction<TFields, TMeta> {
        return {
            errors,
            form: this.title,
            meta,
            type: this.types.SET_ERRORS
        };
    }

    resetErrors(meta: TMeta = undefined as any): FormSetErrorsAction<TFields, TMeta> {
        return this.setErrors(undefined, meta);
    }

    reset(meta: TMeta = undefined as any): FormResetAction<TMeta> {
        return {
            form: this.title,
            meta,
            type: this.types.RESET
        };
    }

    isSetData(action?: Action): action is FormSetDataAction<TFields, TMeta> {
        return !!action && action.type === this.types.SET_DATA;
    }

    isFieldEdit(action?: Action): action is FieldEditAction<TFields, TMeta> {
        return !!action && action.type === this.types.FIELD_EDIT;
    }

    isFieldFormat(action?: Action): action is FieldFormatAction<TFields, TMeta> {
        return !!action && action.type === this.types.FIELD_FORMAT;
    }

    isValidate(action?: Action): action is FormValidateAction<TMeta> {
        return !!action && action.type === this.types.VALIDATE;
    }

    isReset(action?: Action): action is FormResetAction<TMeta> {
        return !!action && action.type === this.types.RESET;
    }

    isSetErrors(action: Action): action is FormSetErrorsAction<TFields, TMeta> {
        return !!action && action.type === this.types.SET_ERRORS;
    }

    isMyAction(action: Action): action is RdReduxFormActionBase<TMeta> {
        if (action && `${action.type}`.indexOf(this.actionPrefix()) === 0) {
            return (action as RdReduxFormActionBase<TMeta>).form === this.title;
        }

        return false;
    }

    private makeActionType(action: string): string {
        if (!action) {
            throw new Error("Action is not defined.");
        }

        return `${this.actionPrefix()} ${action.toLowerCase()}`;
    }

    private actionPrefix(): string {
        return `RD-FORM :: ${this.title} ::`;
    }
}
