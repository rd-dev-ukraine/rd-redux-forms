import { FieldActionConfigurationBuilder } from "../configuration";
export declare type DispatchProxyFunction = (value: any) => Promise<any>;
export declare class EventConfigBuilder {
    private events;
    add<TEvent>(action: keyof FieldActionConfigurationBuilder, event: string, argsParser: (event: TEvent) => any, isDefault?: boolean): void;
    preDispatch(action: keyof FieldActionConfigurationBuilder, event: string, proxy: DispatchProxyFunction): void;
}
