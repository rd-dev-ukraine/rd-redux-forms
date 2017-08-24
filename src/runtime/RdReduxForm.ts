import { Action } from "redux";
import {
    FieldConfiguration,
    FieldSelectorResult,
    FormActions,
    FormConfiguration,
    FormSelectorResult,
    RdReduxForm,
    RdReduxFormConnect,
    RdReduxFormState
} from "../api";
import { entries, isNullOrEmptyArray } from "../utils";
import { FormActionsImpl } from "./FormActionsImpl";

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
                formatted: new Set<string>(),
                touched: new Set<string>(),
                validated: false
            };
        },

        /**
         * Gets the state for the form with data.
         * Do the same thing as dispatching setData action with resetting, but can be used in reducer.
         */
        withData(data: TFields): RdReduxFormState<TFields> {
            return {
                errors: undefined,
                fields: data,
                formatted: new Set<string>(),
                touched: new Set<string>(),
                validated: false
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
                errors: action.resetState ? undefined : state.errors,
                fields: action.data,
                formatted: action.resetState ? new Set<string>() : state.formatted,
                touched: action.resetState ? new Set<string>() : state.touched,
                validated: action.resetState ? false : state.validated
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
                formatted: new Set<string>(state.formatted),
                touched: state.touched.add(action.field)
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
                errors: undefined,
                formatted: new Set<string>(),
                touched: new Set<string>(),
                validated: true
            };
        }

        if (this.actions.isReset(action)) {
            return {
                ...(state as any),
                errors: undefined,
                formatted: new Set<string>(),
                touched: new Set<string>(),
                validated: false
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

    selector(state: RdReduxFormState<TFields>, ...initialData: Array<Partial<TFields>>): FormSelectorResult<TFields> {
        state = state || this.state.empty();

        const initialValues: Partial<TFields> = Object.assign({}, ...[...initialData, state.fields]);

        const parsedFields = entries<FieldConfiguration<any>>(this.config.fields)
            .reduce<FieldHash<FieldSelectorResult>>((result, [field, config]) => {
                const parser = config.parser || ((v) => v);
                const formatter = config.formatter ||
                    ((v) => (v === null || v === undefined || isNaN(v)) ? "" : "" + v);

                const rawValue = initialValues[field] as any;
                const parsedValue = parser(rawValue);

                if (parsedValue === undefined) {
                    result[field] = {
                        errors: [config.parseError || "Value is not valid."],
                        formattedValue: rawValue,
                        isParsed: false,
                        value: rawValue || "",
                        visualState: "none"
                    };
                } else {
                    result[field] = {
                        formattedValue: formatter(parsedValue),
                        isParsed: true,
                        parsedValue,
                        value: rawValue || "",
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
                (state.errors.fields &&
                    entries<string[]>(state.errors.fields).some(([_, err]) => !isNullOrEmptyArray(err)))
            );

        return {
            data: isAllParsed ? data : undefined,
            fields: entries<FieldSelectorResult>(parsedFields)
                .reduce<FieldTypedHash<TFields, FieldSelectorResult>>((result, [name, val]) => {
                    const error = val.isParsed
                        ? state.errors && state.errors.fields && !isNullOrEmptyArray(state.errors.fields[name])
                            ? state.errors.fields[name]
                            : undefined
                        : val.errors;
                    const hasError = !val.isParsed || !isNullOrEmptyArray(error);

                    const showErrors = (!val.isParsed && state.formatted.has(name)) ||
                        (state.validated && !state.touched.has(name));

                    result[name] = {
                        errors: hasError ? error : undefined,
                        formattedValue: val.formattedValue,
                        isParsed: val.isParsed,
                        parsedValue: val.parsedValue,
                        value: val.value,
                        visualState: showErrors
                            ? (hasError ? "invalid" : "valid")
                            : "none"
                    };

                    return result;
                }, {} as any),
            formError: state.errors ? state.errors.message : undefined,
            isValid: (isAllParsed && !hasExtraErrors) || !!state.touched.size
        };
    }

    private createConnect(): RdReduxFormConnect<TFields, TMeta> {
        const self = this;

        const result = {
            dispatch: this.config.dispatch(this.config, this.actions),
            stateToFields: (state: RdReduxFormState<TFields>) => self.selector(state)
        };

        return result;
    }
}
