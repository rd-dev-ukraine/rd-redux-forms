import { Dispatch } from "redux";
import { RdReduxForm } from "../../index";
import { AnyFormBindingTypeConfiguration, BindingFactory, FormBindings } from "../configuration";
import { TypedFormBindingTypeConfiguration } from "../index";
import { FieldBindingConfiguration } from "./field-binding-configuration";
export declare class FormBindingConfiguration implements AnyFormBindingTypeConfiguration, TypedFormBindingTypeConfiguration<any, any>, BindingFactory<any, any> {
    private allFieldConfig;
    private fieldsConfig;
    private form;
    /**
     * Specifies a form for the binidng configuration.
     *
     * @param form A form configuration for binidng
     */
    withForm<TForm, TMeta>(form: RdReduxForm<TForm, TMeta>): TypedFormBindingTypeConfiguration<TForm, TMeta>;
    /**
     * Configure bindings for all fields.
     */
    allFields(): FieldBindingConfiguration & {
        end(): FormBindingConfiguration;
    };
    configureFields(fieldsConfig: any): BindingFactory<any, any>;
    bind(dispatch: Dispatch<any>, meta: any): FormBindings<any>;
}
