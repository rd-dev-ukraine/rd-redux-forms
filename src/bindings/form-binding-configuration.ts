import * as React from "react";
import { Dispatch } from "redux";
import { FieldInfo } from "../api";
import { InvalidFormInfo, RdReduxForm, ValidFormInfo } from "../index";
import {
    AnyFormBindingConfiguration,
    BindingFactory,
    FieldProps,
    FormBindings,
    FormProps,
    TypedFormBindingTypeConfiguration
} from "./configuration";
import { FieldBindingConfiguration } from "./field-binding-configuration";

export class FormBindingConfiguration
    implements AnyFormBindingConfiguration, TypedFormBindingTypeConfiguration<any, any>, BindingFactory<any, any> {
    private allFieldConfig: FieldBindingConfiguration;
    private fieldsConfig: { [field: string]: FieldBindingConfiguration } = {};

    private form: RdReduxForm<any, any> | undefined;

    private validateFormOnSubmit = false;

    /**
     * Specifies a form for the binidng configuration.
     *
     * @param form A form configuration for binidng
     */
    withForm<TForm, TMeta>(form: RdReduxForm<TForm, TMeta>): TypedFormBindingTypeConfiguration<TForm, TMeta> {
        if (!form) {
            throw new Error("Form is not defined.");
        }

        this.form = form;
        return this;
    }

    validateOnSubmit(): this {
        this.validateFormOnSubmit = true;
        return this;
    }

    /**
     * Configure bindings for all fields.
     */
    forAllFields(): FieldBindingConfiguration & { end(): FormBindingConfiguration } {
        this.allFieldConfig = new FieldBindingConfiguration();
        (this.allFieldConfig as any).end = () => this;

        return this.allFieldConfig as any;
    }

    configureFields(fieldsConfig: any): BindingFactory<any, any> {
        if (!fieldsConfig) {
            throw new Error("Fields configuration is not defined.");
        }

        this.fieldsConfig = fieldsConfig(new FieldBindingConfiguration());

        return this;
    }

    bind(dispatch: Dispatch<any>, meta: any): FormBindings<any> {
        if (!dispatch) {
            throw new Error("Dispatch function is not defined.");
        }
        if (!this.form) {
            throw new Error("Form is not attached to the binding config.");
        }

        const form: RdReduxForm<any, any> = this.form;

        const fieldEvents = this.form.fields.reduce((result: any, field: string) => {
            const bindingFactory = (this.fieldsConfig || {})[field] || this.allFieldConfig;
            result[field] = bindingFactory.build<any, any>(form, field, dispatch, meta);

            return result;
        }, {});

        const formEvents = this.validateFormOnSubmit
            ? {
                  onSubmit: (e: React.FormEvent<any>) => {
                      e.preventDefault();
                      dispatch(form.actions.validate(meta));
                  }
              }
            : {};

        return {
            connect: (formSelectionResult: ValidFormInfo<any> | InvalidFormInfo<any>): FormProps<any> => ({
                fields: Object.keys(formSelectionResult.fields).reduce((result: any, fieldName) => {
                    const fieldInfo = formSelectionResult.fields[fieldName];
                    const events = fieldEvents[fieldName];

                    result[fieldName] = {
                        ...fieldInfo,
                        checkbox: (checkedValue: any = true, uncheckedValue: any = false) => {
                            const { onChange, ...rest } = events;
                            return {
                                ...rest,
                                checked: fieldInfo.value === checkedValue ? true : false,
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.currentTarget.type === "radio") {
                                        if (e.currentTarget.checked) {
                                            onChange(checkedValue);
                                        }
                                    } else {
                                        onChange(e.currentTarget.checked ? checkedValue : uncheckedValue);
                                    }
                                }
                            };
                        },
                        events,
                        input: (replaceUndefinedOrNullValue: boolean, replaceWith: any = "") => ({
                            ...events,
                            value:
                                (fieldInfo.value === undefined || fieldInfo.value === null) &&
                                replaceUndefinedOrNullValue
                                    ? replaceWith
                                    : fieldInfo.value
                        }),
                        multiCheckbox: (value: any) => {
                            const { onChange, ...rest } = events;

                            return {
                                ...rest,
                                onChange(e: React.ChangeEvent<HTMLInputElement>) {
                                    fieldEvents.onChange(
                                        e.currentTarget.checked
                                            ? [...(fieldInfo.value || []), value]
                                            : (fieldInfo.value || []).filter((el: any) => el !== value)
                                    );
                                }
                            };
                        }
                    } as FieldProps & FieldInfo;

                    return result;
                }, {}),
                formProps: formEvents
            }),
            fields: fieldEvents,
            form: formEvents
        };
    }

    default(): FormBindingConfiguration {
        return this.validateOnSubmit()
            .forAllFields()
            .edit()
            .onChange()
            .startEditing()
            .onFocus()
            .endEditing()
            .onBlur()
            .end();
    }
}
