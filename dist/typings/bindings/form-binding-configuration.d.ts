import { Dispatch } from "redux";
import { RdReduxForm } from "../index";
import { AnyFormBindingConfiguration, BindingFactory, FormBindings, TypedFormBindingTypeConfiguration } from "./configuration";
import { FieldBindingConfiguration } from "./field-binding-configuration";
export declare class FormBindingConfiguration implements AnyFormBindingConfiguration, TypedFormBindingTypeConfiguration<any, any>, BindingFactory<any, any> {
    private allFieldConfig;
    private fieldsConfig;
    private form;
    private validateFormOnSubmit;
    /**
     * Specifies a form for the binidng configuration.
     *
     * @param form A form configuration for binidng
     */
    withForm<TForm, TMeta>(form: RdReduxForm<TForm, TMeta>): TypedFormBindingTypeConfiguration<TForm, TMeta>;
    validateOnSubmit(): this;
    /**
     * Configure bindings for all fields.
     */
    forAllFields(): FieldBindingConfiguration & {
        end(): FormBindingConfiguration;
    };
    configureFields(fieldsConfig: any): BindingFactory<any, any>;
    bind(dispatch: Dispatch<any>, meta: any): FormBindings<any>;
    default(): FormBindingConfiguration;
}
