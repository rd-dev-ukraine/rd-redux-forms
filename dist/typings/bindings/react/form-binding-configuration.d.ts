import { ActionTriggerConfigurationBuilder, FieldActionConfigurationBuilder, TriggerConfigurationBuilder } from "../configuration";
export declare class FormBindingConfiguration implements FieldActionConfigurationBuilder, ActionTriggerConfigurationBuilder, TriggerConfigurationBuilder {
    private defaultFieldBinding;
    private lastAction;
    private lastEvent;
    submit(): this;
    format(): this;
    unformat(): this;
    edit(): this;
    onChange(isDefault?: boolean): this;
    onFocus(isDefault?: boolean): this;
    onBlur(isDefault?: boolean): this;
    onEvent<T>(event: string, argParser: (event: T) => any, isDefault?: boolean): this;
    throttle(timeout: number): FieldActionConfigurationBuilder;
}
