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
import { FormBindings } from "../bindings";
import { shallowCompareArrays, shallowCompareObjectsWithSameProps } from "../utils";
import { FormActionsImpl } from "./FormActionsImpl";
import { CalculateVisualStateStrategies } from "./VisualStateCalc";

let formCounter = 0;

export class RdReduxFormImpl<TFields, TMeta> implements RdReduxForm<TFields, TMeta> {
    id: string = `${++formCounter}`;

    types = {
        get fields(): TFields {
            throw new Error("Use with Typescript typeof expression only.");
        },

        get meta(): TMeta {
            throw new Error("Use with Typescript typeof expression only.");
        },

        get state(): ReduxFormState<TFields> {
            throw new Error("Use with Typescript typeof expression only.");
        },

        get eventBindings(): FormBindings<TFields> {
            throw new Error("Use with Typescript typeof expression only.");
        },

        get selectorResult(): ValidFormInfo<TFields> | InvalidFormInfo<TFields> {
            throw new Error("Use with Typescript typeof expression only.");
        }
    };

    fields: string[] = [];

    actions: FormActions<TFields, TMeta> = new FormActionsImpl<TFields, TMeta>(this.title);

    state = {
        /**
         * Gets the state for the form without data.
         */
        empty(): ReduxFormState<TFields> {
            return {
                editing: {},
                fields: {} as any,
                touched: {},
                validated: false
            };
        },

        /**
         * Gets the state for the form with data.
         * Do the same thing as dispatching setData action with resetting, but can be used in reducer.
         */

        withData(data: Partial<TFields>): ReduxFormState<TFields> {
            return {
                editing: {},
                fields: data,
                touched: {},
                validated: false
            };
        }
    };

    constructor(public title: string, private fieldConfiguration: FormFieldsConfiguration<TFields>) {
        if (!title) {
            throw new Error("Form title is not defined.");
        }

        if (!fieldConfiguration) {
            throw new Error("Form field configuraion is not defined.");
        }

        this.fields = Object.keys(fieldConfiguration);
    }

    reducer = <TState extends ReduxFormState<TFields>>(state: TState, action: Action): TState => {
        state = state || (this.state.empty() as TState);

        if (this.actions.isSetData(action)) {
            return {
                ...(state as any),
                editing: action.resetState ? {} : state.editing,
                errors: action.resetState ? undefined : state.errors,
                fields: action.data,
                selectorResultCache: undefined,
                touched: action.resetState ? {} : state.touched,
                validated: action.resetState ? false : state.validated
            };
        }

        if (this.actions.isFieldEdit(action)) {
            return {
                ...(state as any),
                editing:
                    state.editing && state.editing[action.field] === "unchanged"
                        ? {
                              ...(state.editing as any),
                              [action.field]: "changed"
                          }
                        : state.editing,
                fields: {
                    ...(state.fields as any),
                    [action.field]: action.value
                },
                selectorResultCache: undefined,
                touched: { ...(state.touched as any), [action.field]: true }
            };
        }

        if (this.actions.isFieldStartEditing(action)) {
            return {
                ...(state as any),
                editing: {
                    ...(state.editing as any),
                    [action.field]: "unchanged"
                }
            };
        }

        if (this.actions.isFieldEndEditing(action)) {
            const editing = { ...(state.editing as any) };
            delete editing[action.field];

            return { ...(state as any), editing };
        }

        if (this.actions.isValidate(action)) {
            return {
                ...(state as any),
                errors: state.errors,
                formatted: {},
                touched: {},
                validated: true
            };
        }

        if (this.actions.isReset(action)) {
            return {
                ...(state as any),
                errors: undefined,
                formatted: {},
                selectorResultCache: undefined,
                touched: {},
                validated: false
            };
        }

        if (this.actions.isSetErrors(action)) {
            return {
                ...(state as any),
                errors: action.errors,
                formatted: {},
                selectorResultCache: undefined,
                touched: {},
                validated: true
            };
        }

        return state;
    }

    selector = (
        state: ReduxFormState<TFields>,
        ...initialData: Array<Partial<TFields>>
    ): ValidFormInfo<TFields> | InvalidFormInfo<TFields> => {
        const result = this.selectorCore(state, ...initialData);

        if (!state.selectorResultCache || !this.areSelectorResultsEqual(state.selectorResultCache, result)) {
            state.selectorResultCache = result;
        }

        return state.selectorResultCache;
    }

    /** Calculate non-cached form state selection result */
    private selectorCore = (
        state: ReduxFormState<TFields>,
        ...initialData: Array<Partial<TFields>>
    ): ValidFormInfo<TFields> | InvalidFormInfo<TFields> => {
        state = state || this.state.empty();

        const formValues: Partial<TFields> = Object.assign({}, ...[...initialData, state.fields]);

        const fields: Array<[string, FieldInfo]> = Object.keys(this.fieldConfiguration).map<[string, FieldInfo]>(
            (n: string) => {
                const fieldName: keyof TFields = n as any;
                const fieldConfig = this.fieldConfiguration[fieldName];

                const parser = fieldConfig.parse || ((v: any) => v);
                const formatForDisplay = fieldConfig.formatForDisplay || ((value: any) => value);
                const formatForEditing = fieldConfig.formatForEditing || ((value: any) => value);

                const rawValue = formValues[fieldName] as any;
                const fieldEditingStatus = state.editing[fieldName];
                const isFieldTouched = !!state.touched[fieldName];

                // Successfully parsed
                const fieldCustomErrors: string[] | undefined =
                    !!state.errors &&
                    !!state.errors.fields &&
                    !!state.errors.fields[fieldName] &&
                    !!(state.errors.fields[fieldName] as any[]).length
                        ? state.errors.fields[fieldName]
                        : undefined;

                try {
                    const parsedValue = parser(rawValue);

                    if (fieldCustomErrors) {
                        // Parsed but has custom error set field
                        const field: ParsedFieldWithCustomErrorInfo = {
                            data: parsedValue,
                            errors: fieldCustomErrors,
                            hasCustomErrors: true,
                            isParsed: true,
                            value: !fieldEditingStatus
                                ? formatForDisplay(parsedValue)
                                : fieldEditingStatus === "unchanged"
                                ? formatForEditing(rawValue)
                                : rawValue,
                            visualState: CalculateVisualStateStrategies.default(
                                state.validated,
                                true,
                                true,
                                isFieldTouched,
                                !!fieldEditingStatus
                            )
                        };

                        return [fieldName, field];
                    } else {
                        // Valid field info
                        const field: ValidFieldInfo = {
                            data: parsedValue,
                            hasCustomErrors: false,
                            isParsed: true,
                            value: !fieldEditingStatus
                                ? formatForDisplay(parsedValue)
                                : fieldEditingStatus === "unchanged"
                                ? formatForEditing(rawValue)
                                : rawValue,
                            visualState: CalculateVisualStateStrategies.default(
                                state.validated,
                                true,
                                false,
                                isFieldTouched,
                                !!fieldEditingStatus
                            )
                        };

                        return [fieldName, field];
                    }
                } catch (e) {
                    const field: NonParsedFieldInfo = {
                        errors: [e.message, ...(fieldCustomErrors || [])],
                        hasCustomErrors: !!fieldCustomErrors,
                        isParsed: false,
                        value: fieldEditingStatus === "unchanged" ? formatForEditing(rawValue) : rawValue,
                        visualState: CalculateVisualStateStrategies.default(
                            state.validated,
                            false,
                            !!fieldCustomErrors,
                            isFieldTouched,
                            !!fieldEditingStatus
                        )
                    };

                    return [fieldName, field] as any;
                }
            }
        );

        const isFormValid = fields.every(([_, f]) => f.isParsed);
        const hasFormError = state.errors && state.errors.message && state.errors.message.length;

        if (!isFormValid) {
            const formInfo: InvalidFormInfo<TFields> = {
                customFormError: hasFormError && state.errors ? state.errors.message : undefined,
                fields: fields.reduce<any>((result: any, [fieldName, f]) => {
                    result[fieldName] = f;
                    return result;
                }, {}),
                hasCustomErrors: !!hasFormError || fields.some(([_, f]) => f.hasCustomErrors),
                isValid: false
            };

            return formInfo;
        } else {
            const formInfo: ValidFormInfo<TFields> = {
                data: fields.reduce<any>((result: any, [fieldName, f]) => {
                    if (f.isParsed) {
                        result[fieldName] = f.data;
                    }
                    return result;
                }, {}),
                fields: fields.reduce<any>((result: any, [fieldName, f]) => {
                    result[fieldName] = f;
                    return result;
                }, {}),
                hasCustomErrors: !!hasFormError || fields.some(([_, f]) => f.hasCustomErrors),
                isValid: true
            };

            return formInfo;
        }
    }

    private areSelectorResultsEqual = (
        r1: ValidFormInfo<TFields> | InvalidFormInfo<TFields>,
        r2: ValidFormInfo<TFields> | InvalidFormInfo<TFields>
    ): boolean => {
        if (r1.isValid !== r2.isValid) {
            return false;
        }

        if (!r1.isValid && !r2.isValid && !shallowCompareArrays(r1.customFormError, r2.customFormError)) {
            return false;
        }

        for (const fieldName of Object.keys(this.fieldConfiguration)) {
            const f1 = (r1.fields as any)[fieldName] as FieldInfo;
            const f2 = (r2.fields as any)[fieldName] as FieldInfo;

            if (!shallowCompareObjectsWithSameProps(f1, f2)) {
                return false;
            }
        }

        return true;
    }
}
