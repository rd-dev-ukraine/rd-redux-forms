import { Dispatch } from "redux";
import { RdReduxForm } from "../index";
/** An property bindings (usually event handlers) for form and inputs. */
export interface FormBindings<TFields> {
    /** An event handlers for a <form> tag */
    form: any;
    /** An event handlers for each field input. */
    fields: {
        [P in keyof TFields]: any;
    };
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
export interface FormBindingConfigurationBuilder {
    /**
     * Creates a binding for form with 'default' behaviour:
     * * form is validated on submit
     * * field is edit on change
     * * field is formatted on blur
     * * field is unformatted on focus
     *
     */
    default(): AnyFormBindingTypeConfiguration;
}
export interface AnyFormBindingTypeConfiguration {
    withForm<TFields, TMeta>(form: RdReduxForm<TFields, TMeta>): TypedFormBindingTypeConfiguration<TFields, TMeta>;
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
    format(): FieldActionConfigurationBuilder & ActionTriggerConfigurationBuilder;
    unformat(): FieldActionConfigurationBuilder & ActionTriggerConfigurationBuilder;
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
