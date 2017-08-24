import { Action } from "redux";

import {
    FieldEditAction,
    FormActions,
    FormConfiguration,
    FormSetDataAction,
    FormResetAction,
    FormValidateAction,
    RdReduxForm,
    RdReduxFormActionBase,
    RdReduxFormConnect,
    RdReduxFormState,
    FormSelectorResult,
    FieldSelectorResult,
    FieldConfiguration,
    FormErrors,
    FormSetErrorsAction,
    FieldFormatAction
} from "../api";
import { entries, isNullOrEmptyArray } from "../utils";


interface FieldHash<T> {
    [field: string]: T;
}

export type FieldTypedHash<T, F> = {
    [P in keyof T]: F;
};

export class RdReduxFormImpl<TFields, TMeta = undefined> implements RdReduxForm<TFields, TMeta> {

    actions: FormActions<TFields, TMeta> = new FormActionsImpl<TFields, TMeta>(this.title);
    connect: RdReduxFormConnect<TFields, TMeta> = this.createConnect();
    state = {
        /**
         * Gets the state for the form without data.
         */
        empty(): RdReduxFormState<TFields> {
            return {
                fields: {} as any,
                touched: new Set<string>(),
                formatted: new Set<string>(),
                validated: false
            };
        },

        /**
         * Gets the state for the form with data.
         * Do the same thing as dispatching setData action with resetting, but can be used in reducer.
         */
        withData(data: TFields): RdReduxFormState<TFields> {
            return {
                fields: data,
                touched: new Set<string>(),
                formatted: new Set<string>(),
                validated: false,
                errors: undefined
            };
        }
    };

    constructor(private title: string, private config: FormConfiguration<TFields, TMeta>) {
        if (!title) {
            throw new Error("Form title is not defined.");
        }

        if (!config) {
            throw new Error("Form configuraion is not defined.");
        }
    }

    reducer<TState extends RdReduxFormState<TFields>>(state: TState, action: Action): TState {
        state = state || this.state.empty();

        if (this.actions.isSetData(action)) {
            return {
                ...(state as any),
                fields: action.data,
                touched: action.resetState ? new Set<string>() : state.touched,
                formatted: action.resetState ? new Set<string>() : state.formatted,
                validated: action.resetState ? false : state.validated,
                errors: action.resetState ? undefined : state.errors
            };
        }

        if (this.actions.isFieldEdit(action)) {
            state.formatted.delete(action.field);
            return {
                ...(state as any),
                fields: {
                    ...(state.fields as any),
                    [action.field]: action.value
                },
                touched: state.touched.add(action.field),
                formatted: new Set<string>(state.formatted)
            };
        }

        if (this.actions.isFieldFormat(action)) {
            return {
                ...(state as any),
                formatted: state.formatted.add(action.field)
            };
        }

        if (this.actions.isValidate(action)) {
            return {
                ...(state as any),
                validated: true,
                touched: new Set<string>(),
                formatted: new Set<string>(),
                errors: undefined
            };
        }

        if (this.actions.isReset(action)) {
            return {
                ...(state as any),
                validated: false,
                errors: undefined,
                touched: new Set<string>(),
                formatted: new Set<string>()
            };
        }

        if (this.actions.isSetErrors(action)) {
            return {
                ...(state as any),
                errors: action.errors
            };
        }

        return state;
    }

    selector(state: RdReduxFormState<TFields>, ...initialData: Partial<TFields>[]): FormSelectorResult<TFields> {
        state = state || this.state.empty();

        const initialValues: Partial<TFields> = Object.assign({}, ...[...initialData, state.fields]);


        const parsedFields = entries<FieldConfiguration<any>>(this.config.fields)
            .reduce<FieldHash<FieldSelectorResult>>((result, [field, config]) => {
                const parser = config.parser || (v => v);
                const formatter = config.formatter || (v => (v === null || v === undefined || isNaN(v)) ? "" : "" + v);

                const rawValue = initialValues[field] as any;
                const parsedValue = parser(rawValue);

                if (parsedValue === undefined) {
                    result[field] = {
                        value: rawValue || "",
                        formattedValue: rawValue,
                        isParsed: false,
                        errors: [config.parseError || "Value is not valid."],
                        visualState: "none"
                    };
                } else {
                    result[field] = {
                        value: rawValue || "",
                        formattedValue: formatter(parsedValue),
                        parsedValue,
                        isParsed: true,
                        visualState: "none"
                    };
                }

                return result;
            }, {});

        const isAllParsed = entries<FieldSelectorResult>(parsedFields).every(([_, info]) => info.isParsed);

        const data = entries<FieldSelectorResult>(parsedFields)
            .filter(([_, val]) => val.isParsed)
            .reduce<TFields>((result: any, [name, val]) => {
                result[name] = val.parsedValue;
                return result;
            }, {} as TFields);

        const hasExtraErrors = state.errors &&
            (
                !isNullOrEmptyArray(state.errors.message) ||
                (state.errors.fields && entries<string[]>(state.errors.fields).some(([_, err]) => !isNullOrEmptyArray(err)))
            );

        return {
            isValid: (isAllParsed && !hasExtraErrors) || !!state.touched.size,
            data: isAllParsed ? data : undefined,
            formError: state.errors ? state.errors.message : undefined,

            fields: entries<FieldSelectorResult>(parsedFields)
                .reduce<FieldTypedHash<TFields, FieldSelectorResult>>((result, [name, val]) => {
                    const error = val.isParsed
                        ? state.errors && state.errors.fields && !isNullOrEmptyArray(state.errors.fields[name])
                            ? state.errors.fields[name]
                            : undefined
                        : val.errors;
                    const hasError = !val.isParsed || !isNullOrEmptyArray(error);

                    const showErrors = (!val.isParsed && state.formatted.has(name)) || (state.validated && !state.touched.has(name));

                    result[name] = {
                        value: val.value,
                        isParsed: val.isParsed,
                        parsedValue: val.parsedValue,
                        formattedValue: val.formattedValue,
                        errors: hasError ? error : undefined,
                        visualState: showErrors
                            ? (hasError ? "invalid" : "valid")
                            : "none"
                    };

                    return result;
                }, {} as any)
        };
    }

    private createConnect(): RdReduxFormConnect<TFields, TMeta> {
        const self = this;

        const result = {
            stateToFields: (state: RdReduxFormState<TFields>) => self.selector(state),
            dispatch: this.config.dispatch(this.config, this.actions)
        };

        return result;
    }
}

const SET_DATA = "SET_DATA";
const FIELD_EDIT = "EDIT_FIELD";
const FIELD_FORMAT = "FORMAT_FIELD";
const VALIDATE = "VALIDATE";
const RESET = "RESET";
const SET_ERRORS = "SET_ERRORS";

class FormActionsImpl<TFields, TMeta = undefined> implements FormActions<TFields, TMeta> {
    constructor(private title: string) { }

    setData(data: Partial<TFields>, resetState: boolean = false, meta: TMeta = undefined as any): FormSetDataAction<TFields, TMeta> {
        if (!data) {
            throw new Error("Data is not defined.");
        }

        return {
            type: this.makeActionType(SET_DATA),
            form: this.title,
            data,
            resetState,
            meta
        };
    }

    fieldEdit(field: keyof TFields, value: any, meta: TMeta = undefined as any): FieldEditAction<TFields, TMeta> {
        if (!field) {
            throw new Error("Field is not defined.");
        }

        return {
            type: this.makeActionType(FIELD_EDIT),
            form: this.title,
            field,
            value,
            meta
        };
    }

    fieldFormat(field: keyof TFields, meta: TMeta = undefined as any): FieldFormatAction<TFields, TMeta> {
        if (!field) {
            throw new Error("Field is not defined.");
        }

        return {
            type: this.makeActionType(FIELD_FORMAT),
            form: this.title,
            field,
            meta
        };
    }

    validate(meta: TMeta = undefined as any): FormValidateAction<TMeta> {
        return {
            type: this.makeActionType(VALIDATE),
            form: this.title,
            meta
        };
    }

    setErrors(errors?: FormErrors<TFields>, meta: TMeta = undefined as any): FormSetErrorsAction<TFields, TMeta> {
        return {
            type: this.makeActionType(SET_ERRORS),
            form: this.title,
            errors,
            meta
        };
    }

    resetErrors(meta: TMeta = undefined as any): FormSetErrorsAction<TFields, TMeta> {
        return this.setErrors(meta);
    }

    reset(meta: TMeta = undefined as any): FormResetAction<TMeta> {
        return {
            type: this.makeActionType(RESET),
            form: this.title,
            meta
        };
    }

    isSetData(action?: Action): action is FormSetDataAction<TFields, TMeta> {
        return !!action && action.type === this.makeActionType(SET_DATA);
    }

    isFieldEdit(action?: Action): action is FieldEditAction<TFields, TMeta> {
        return !!action && action.type === this.makeActionType(FIELD_EDIT);
    }

    isFieldFormat(action?: Action): action is FieldFormatAction<TFields, TMeta> {
        return !!action && action.type === this.makeActionType(FIELD_FORMAT);
    }

    isValidate(action?: Action): action is FormValidateAction<TMeta> {
        return !!action && action.type === this.makeActionType(VALIDATE);
    }

    isReset(action?: Action): action is FormResetAction<TMeta> {
        return !!action && action.type === this.makeActionType(RESET);
    }

    isSetErrors(action: Action): action is FormSetErrorsAction<TFields, TMeta> {
        return !!action && action.type === this.makeActionType(SET_ERRORS);
    }

    isMyAction(action: Action): action is RdReduxFormActionBase<TMeta> {
        if (action && `${action.type}`.indexOf(this.actionPrefix()) === 0) {
            return (action as RdReduxFormActionBase).form === this.title;
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