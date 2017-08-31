export interface AnyFormBindingTypeConfiguration {
}
export interface FieldActionConfigurationBuilder {
    submit(): ActionTriggerConfigurationBuilder & FieldActionConfigurationBuilder;
    format(): ActionTriggerConfigurationBuilder & FieldActionConfigurationBuilder;
    unformat(): ActionTriggerConfigurationBuilder & FieldActionConfigurationBuilder;
    edit(): ActionTriggerConfigurationBuilder & FieldActionConfigurationBuilder;
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
