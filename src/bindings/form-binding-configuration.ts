import * as React from "react";

import { Dispatch } from "redux";
import { RdReduxForm } from "../index";
import {
    AnyFormBindingConfiguration,
    BindingFactory,
    FormBindings,
    TypedFormBindingTypeConfiguration
} from "./configuration";
import { FieldBindingConfiguration } from "./field-binding-configuration";

export class FormBindingConfiguration implements
    AnyFormBindingConfiguration,
    TypedFormBindingTypeConfiguration<any, any>,
    BindingFactory<any, any> {

    private allFieldConfig: FieldBindingConfiguration;
    private fieldsConfig: { [field: string]: FieldBindingConfiguration; } = {};

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

        this.fieldsConfig = fieldsConfig;

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

        const fields = this.form.fields.reduce((result: any, field: string) => {
            const bindingFactory = (this.fieldsConfig || {})[field] || this.allFieldConfig;
            result[field] = bindingFactory.build<any, any>(form, field, dispatch, meta);

            return result;
        }, {});

        return {
            fields,
            form: this.validateFormOnSubmit
                ? { onSubmit: (e: React.FormEvent<any>) => dispatch(form.actions.validate(meta)) }
                : {},
        };
    }

    default(): FormBindingConfiguration {
        return this.validateOnSubmit()
            .forAllFields()
            .edit().onChange()
            .format().onBlur()
            .unformat().onFocus()
            .end();
    }

}
