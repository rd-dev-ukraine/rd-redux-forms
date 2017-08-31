import { FieldActionConfigurationBuilder } from "../configuration";

export type DispatchProxyFunction = (value: any) => Promise<any>;

export class EventConfigBuilder {
    private events: FieldEventBindingConfig[] = [];

    add<TEvent>(
        action: keyof FieldActionConfigurationBuilder,
        event: string,
        argsParser: (event: TEvent) => any,
        isDefault = false): void {

        const existing = this.events
            .find((e) => e.action === action && e.event === event);

        if (isDefault) {
            if (!existing) {
                this.events = this.events.filter((e) => e !== existing)
                    .concat([{
                        action,
                        argsParser,
                        event,
                        isDefault: true
                    }]);
            }
            // Otherwise do nothing, default event should not override existing default event
        } else {
            if (!existing || existing.isDefault) {
                this.events = this.events.filter((e) => e !== existing)
                    .concat([{
                        action,
                        argsParser,
                        event,
                        isDefault: false
                    }]);
            }
        }
    }

    preDispatch(action: keyof FieldActionConfigurationBuilder,
                event: string,
                proxy: DispatchProxyFunction): void {

        this.events = this.events.map((e) => {
            if (e.action === action && e.event === event) {
                return {
                    ...e,
                    dispatchProxy: combineDispatchProxy(proxy, e.dispatchProxy),
                    isDefault: false
                };

            } else {
                return e;
            }
        });
    }
}

function combineDispatchProxy(
    newProxy: DispatchProxyFunction,
    existingProxy?: DispatchProxyFunction): DispatchProxyFunction {
    return (value) => {
        if (existingProxy) {
            return existingProxy(value)
                .then((result) => newProxy(result));
        } else {
            return newProxy(value);
        }
    };
}

interface FieldEventBindingConfig {
    /** An action to dispatch in response of event */
    action: keyof FieldActionConfigurationBuilder;

    /** An event to bind to */
    event: string;

    /** Gets the field value from the event args */
    argsParser: (event: any) => any;

    /** True if event handler settings has default values and can be overwritten. */
    isDefault: boolean;

    /**
     * A function which asynchoronously controls action dispatching.
     * Can be used for adding delays or cancel an action dispatching etc.
     */
    dispatchProxy?: (value: any) => Promise<any>;
}
