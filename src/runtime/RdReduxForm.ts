import { Action } from "redux";
import {
    FieldInfo,
    FormActions,
    FormFieldsConfiguration,
    InvalidFormInfo,
    NonParsedFieldInfo,
    ParsedFieldWithCustomErrorInfo,
    RdReduxForm,
    ReduxFormState,
    ValidFieldInfo,
    ValidFormInfo
} from "../api";

import { FormActionsImpl } from "./FormActionsImpl";

const DEFAULT_PARSE_ERROR = "Value is not valid.";

export class RdReduxFormImpl<TFields, TMeta = undefined> implements RdReduxForm<TFields, TMeta> {

    actions: FormActions<TFields, TMeta> = new FormActionsImpl<TFields, TMeta>(this.title);
    state = {
        /**
         * Gets the state for the form without data.
         */
        empty(): ReduxFormState<TFields> {
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
        withData(data: TFields): ReduxFormState<TFields> {
            return {
                errors: undefined,
                fields: data,
                formatted: new Set<string>(),
                touched: new Set<string>(),
                validated: false
            };
        }
    };

    constructor(private title: string, private fieldConfiguration: FormFieldsConfiguration<TFields>) {
        if (!title) {
            throw new Error("Form title is not defined.");
        }

        if (!fieldConfiguration) {
            throw new Error("Form field configuraion is not defined.");
        }
    }

    reducer<TState extends ReduxFormState<TFields>>(state: TState, action: Action): TState {
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

    selector(
        state: ReduxFormState<TFields>,
        ...initialData: Array<Partial<TFields>>):
        ValidFormInfo<TFields> | InvalidFormInfo<TFields> {

        state = state || this.state.empty();

        const initialValues: Partial<TFields> = Object.assign({}, ...[...initialData, state.fields]);

        const fields: Array<[string, FieldInfo]> =
            Object.keys(this.fieldConfiguration)
                .map<[string, FieldInfo]>((fieldName) => {
                    const fieldConfig = this.fieldConfiguration[fieldName];

                    const parser = fieldConfig.parser || ((v) => v);
                    const formatter = fieldConfig.formatter ||
                        ((v: any) => (v === null || v === undefined || isNaN(v)) ? "" : "" + v);

                    const rawValue = initialValues[fieldName] as any;
                    const parsedValue = parser(rawValue);

                    const customErrors = !!state.errors &&
                        !!state.errors.fields &&
                        !!state.errors.fields[fieldName] &&
                        !!(state.errors.fields[fieldName] as any[]).length
                        ? state.errors.fields[fieldName]
                        : undefined;

                    const showErrors = state.formatted.has(fieldName) ||
                        (state.validated && !state.touched.has(fieldName));

                    // Non parsed field info
                    if (parsedValue === undefined) {

                        const field: NonParsedFieldInfo = {
                            errors: {
                                customErrors,
                                errors: [
                                    fieldConfig.parseError || DEFAULT_PARSE_ERROR,
                                    ...(customErrors || [])
                                ],
                                hasCustomErrors: customErrors !== undefined,
                                hasParseError: true,
                                parseError: fieldConfig.parseError || DEFAULT_PARSE_ERROR
                            },
                            hasErrors: true,
                            isParsed: false,
                            value: rawValue,
                            visualState: showErrors ? "invalid" : "none"
                        };

                        return [fieldName, field];

                    } else {
                        // Parsed field with custom errors
                        if (customErrors) {
                            const field: ParsedFieldWithCustomErrorInfo = {
                                errors: {
                                    customErrors,
                                    errors: customErrors,
                                    hasCustomErrors: true
                                },
                                formattedValue: formatter(parsedValue),
                                hasErrors: true,
                                isParsed: true,
                                parsedValue,
                                value: rawValue,
                                visualState: showErrors ? "invalid" : "none"
                            };

                            return [fieldName, field];

                        } else {
                            // Valid field info
                            const field: ValidFieldInfo = {
                                formattedValue: formatter(parsedValue),
                                hasErrors: false,
                                isParsed: true,
                                parsedValue,
                                value: rawValue,
                                visualState: showErrors ? "valid" : "none"
                            };

                            return [fieldName, field];
                        }
                    }
                });

        const isFormValid = fields.every(([_, field]) => !field.hasErrors);
        const hasFormError = state.errors && state.errors.message && state.errors.message.length;

        if (!isFormValid || hasFormError) {
            const formInfo: InvalidFormInfo<TFields> = {
                fields: fields.reduce<any>((result: any, [fieldName, field]) => {
                    result[fieldName] = field;
                    return result;
                }, {}),
                formError: (hasFormError && state.errors) ? state.errors.message : undefined,
                isValid: false,
            };

            return formInfo;
        } else {
            const formInfo: ValidFormInfo<TFields> = {
                data: fields.reduce<any>((result: any, [fieldName, field]) => {
                    if (field.isParsed) {
                        result[fieldName] = field.parsedValue;
                    }
                    return result;
                }, {}),
                fields: fields.reduce<any>((result: any, [fieldName, field]) => {
                    result[fieldName] = field;
                    return result;
                }, {}),
                isValid: true,
            };

            return formInfo;
        }
    }
}
