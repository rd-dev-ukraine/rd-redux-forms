import { Dispatch } from "redux";
import { FieldInfo, InvalidFormInfo, ValidFormInfo } from "../api";
import { RdReduxForm } from "../index";
import { FieldBindingConfiguration } from "./field-binding-configuration";
/** An property bindings (usually event handlers) for form and inputs. */
export interface FormBindings<TFields> {
    /** An event handlers for a <form> tag */
    form: any;
    /** An event handlers for each field input. */
    fields: {
        [P in keyof TFields]: any;
    };
    /**
     * This method could be used in case if you're using `connectAdvanced`
     * to simplify connecting field to an input.
     *
     * It provides an value or value factory for each field
     * which could be just spread {...} on field editor, also few usable
     * method for connecting to radio buttons or checkboxes.
     */
    connect(form: ValidFormInfo<TFields> | InvalidFormInfo<TFields>): FormProps<TFields>;
}
export interface FormProps<TFields> {
    /** Spread this value on <form> tag to provide neccessary event bindings */
    formProps: any;
    fields: {
        [P in keyof TFields]: FieldInfo & FieldProps;
    };
}
export interface FieldProps {
    /**
     * Contains required event bindings.
     * This object doesn't contain field value.
     */
    events: any;
    /**
     * Returns an object with event and value bindings for checkboxes and radiobuttons.
     */
    checkbox(checkedValue?: any, uncheckedValue?: any): any;
    /**
     * Spread this value on field editor tag
     * (usually <input> or <select>) to provide neccessary event and value bindings.
     * Note that some editors like checkboxes and radio should use checkbox() method.
     *
     * Use replaceUndefinedValue and replaceWith if you receives
     * react error about changing input from uncontrolled to controlled.
     */
    input(replaceUndefinedValue: boolean, replaceWith: any): any;
    /**
     * Binding for multiple checkboxes which composes an array value.
     */
    multiCheckbox(value: any): any;
}
/** Creates a rd-redux-form bindings. */
export interface BindingFactory<TFields, TMeta> {
    /**
     * Creates an object ready to spread into the result of the mapDispatchToProperties
     * argument of the connect.
     *
     * @param meta A meta object passed with each dispatched action.
     */
    bind(dispatch: Dispatch<any>, meta: TMeta): FormBindings<TFields>;
}
export interface AnyFormBindingConfiguration {
    /**
     * Creates a binding for form with 'default' behaviour:
     * * form is validated on submit
     * * field is edit on change
     * * field is formatted on blur
     * * field is unformatted on focus
     *
     */
    default(): AnyFormBindingConfiguration;
    withForm<TFields, TMeta>(form: RdReduxForm<TFields, TMeta>): TypedFormBindingTypeConfiguration<TFields, TMeta>;
    validateOnSubmit(): this;
    forAllFields(): FieldBindingConfiguration & {
        end(): AnyFormBindingConfiguration;
    };
}
export interface TypedFormBindingTypeConfiguration<TFields, TMeta> extends BindingFactory<TFields, TMeta> {
    configureFields(fieldsConfig: {
        [P in keyof TFields]?: FieldBindingFactory;
    }): BindingFactory<TFields, TMeta>;
}
export interface FieldBindingFactory {
    build<TFields, TMeta>(form: RdReduxForm<TFields, TMeta>, field: keyof TFields, dispatch: Dispatch<any>, meta: TMeta): any;
}
export interface FieldActionConfigurationBuilder {
    submit(): FieldActionConfigurationBuilder & ActionTriggerConfigurationBuilder;
    startEditing(): FieldActionConfigurationBuilder & ActionTriggerConfigurationBuilder;
    endEditing(): FieldActionConfigurationBuilder & ActionTriggerConfigurationBuilder;
    edit(): FieldActionConfigurationBuilder & ActionTriggerConfigurationBuilder;
}
export interface ActionTriggerConfigurationBuilder {
    onChange(): TriggerConfigurationBuilder & FieldActionConfigurationBuilder;
    onFocus(): TriggerConfigurationBuilder & FieldActionConfigurationBuilder;
    onBlur(): TriggerConfigurationBuilder & FieldActionConfigurationBuilder;
    onEvent<T>(event: string, argParser: (event: T) => any): TriggerConfigurationBuilder & FieldActionConfigurationBuilder;
}
export interface TriggerConfigurationBuilder {
    throttle(timeout: number): FieldActionConfigurationBuilder;
}
