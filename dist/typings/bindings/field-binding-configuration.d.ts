import { Dispatch } from "redux";
import { RdReduxForm } from "../index";
import { ActionTriggerConfigurationBuilder, FieldActionConfigurationBuilder, FieldBindingFactory, TriggerConfigurationBuilder } from "./configuration";
/**
 * Configures an actions dispatched in response to events for a single untyped field.
 */
export declare class FieldBindingConfiguration implements FieldActionConfigurationBuilder, ActionTriggerConfigurationBuilder, TriggerConfigurationBuilder, FieldBindingFactory {
    private bindings;
    private lastAction;
    private lastEvent;
    submit(): this;
    format(): this;
    unformat(): this;
    edit(): this;
    onChange(): this;
    onFocus(): this;
    onBlur(): this;
    onEvent<T>(event: string, argsToValue: (event: T) => any): this;
    throttle(timeout: number): this;
    /**
     * Creates an object contains a set of event handlers
     * for react input element which dispatches rd-redux-forms actions.
     *
     * @param form Form to build a binding for it.
     * @param field Name of the field for building binding.
     * @param dispatch Redux dispatch function.
     * @param meta Additional action parameter.
     *
     * @returns An object contains a map of event handlers for react inputs.
     */
    build<TFields, TMeta>(form: RdReduxForm<TFields, TMeta>, field: keyof TFields, dispatch: Dispatch<any>, meta: TMeta): any;
    private setAction;
    private eventConfig;
    private getEventsOrDefault;
}
