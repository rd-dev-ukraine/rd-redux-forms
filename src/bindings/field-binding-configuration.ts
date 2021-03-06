import * as React from "react";

import { Dispatch } from "redux";
import { RdReduxForm } from "../index";
import {
    ActionTriggerConfigurationBuilder,
    FieldActionConfigurationBuilder,
    FieldBindingFactory,
    TriggerConfigurationBuilder
} from "./configuration";

type FormAction = keyof FieldActionConfigurationBuilder;

/**
 * Configures an actions dispatched in response to events for a single untyped field.
 */
export class FieldBindingConfiguration
    implements
        FieldActionConfigurationBuilder,
        ActionTriggerConfigurationBuilder,
        TriggerConfigurationBuilder,
        FieldBindingFactory {
    private bindings: FieldBindings = {};

    private lastAction: FormAction;
    private lastEvent: string;

    submit(): this {
        return this.setAction("submit");
    }

    startEditing(): this {
        return this.setAction("startEditing");
    }

    endEditing(): this {
        return this.setAction("endEditing");
    }

    edit(): this {
        return this.setAction("edit");
    }

    onChange(): this {
        return this.onEvent("onChange", getValueFromEvent);
    }

    onFocus(): this {
        return this.onEvent("onFocus", getValueFromEvent);
    }

    onBlur(): this {
        return this.onEvent("onBlur", getValueFromEvent);
    }

    onEvent<T>(event: string, argsToValue: (event: T) => any): this {
        const config = this.eventConfig(event);
        config.argToValue = argsToValue;

        return this;
    }

    throttle(timeout: number): this {
        const config = this.eventConfig(this.lastEvent);

        config.run = (() => {
            let timeoutId: number | undefined;

            return (v: any) => {
                return new Promise(resolve => {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }

                    timeoutId = setTimeout(() => resolve(v), timeout) as any;
                });
            };
        })();

        return this;
    }

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
    build<TFields, TMeta>(
        form: RdReduxForm<TFields, TMeta>,
        field: keyof TFields,
        dispatch: Dispatch<any>,
        meta: TMeta
    ): any {
        if (!form) {
            throw new Error("Form is not defined.");
        }
        if (!field) {
            throw new Error("Field is not defined.");
        }

        const eventsMap: {
            [event: string]: {
                [action: string]: EventConfig;
            };
        } = {};

        Object.keys(this.bindings).forEach(action => {
            const events = this.getEventsOrDefault(action as any);

            Object.keys(events).forEach(event => {
                if (!eventsMap[event]) {
                    eventsMap[event] = {};
                }

                eventsMap[event][action] = events[event];
            });
        });

        return Object.keys(eventsMap).reduce((fieldBindings: any, event: string) => {
            const actions = eventsMap[event];

            fieldBindings[event] = (e: any) => {
                Object.keys(actions).forEach((action: string) => {
                    const config = actions[action];

                    const value = config.argToValue(e);

                    const run = config.run || ((val: any) => Promise.resolve(val));

                    // EDIT action must be dispatched synchronously.
                    // Otherwise cursor would jump to the end of input
                    // (even if async operation not really async and promise resolves immediately).
                    if (action === "edit") {
                        dispatch(form.actions.fieldEdit(field, value, meta));
                    } else {
                        run(value).then((val: any) => {
                            switch (action) {
                                case "startEditing": {
                                    dispatch(form.actions.fieldStartEditing(field, meta));
                                    break;
                                }
                                case "endEditing": {
                                    dispatch(form.actions.fieldEndEditing(field, meta));
                                    break;
                                }
                                case "submit": {
                                    dispatch(form.actions.validate(meta));
                                    break;
                                }
                            }
                        });
                    }
                });
            };

            return fieldBindings;
        }, {});
    }

    private setAction(action: FormAction): this {
        this.lastAction = action;

        if (!this.bindings[action]) {
            this.bindings[action] = {};
        }

        return this;
    }

    private eventConfig(event: string): EventConfig {
        this.lastEvent = event;

        if (!this.bindings[this.lastAction]) {
            this.bindings[this.lastAction] = {};
        }

        const events = this.bindings[this.lastAction];

        if (!events[this.lastEvent]) {
            events[this.lastEvent] = {} as any;
        }

        return events[this.lastEvent];
    }

    private getEventsOrDefault(action: FormAction): { [event: string]: EventConfig } {
        const events = this.bindings[action];
        if (!events) {
            throw new Error(`Action ${action} wasn't configured`);
        }

        if (Object.keys(events).length === 0) {
            switch (action) {
                case "startEditing":
                    return this.startEditing()
                        .onBlur()
                        .getEventsOrDefault(action);
                case "endEditing":
                    return this.endEditing()
                        .onFocus()
                        .getEventsOrDefault(action);
                case "edit":
                    return this.edit()
                        .onChange()
                        .getEventsOrDefault(action);
                case "submit":
                    return this.submit()
                        .onChange()
                        .throttle(1000)
                        .getEventsOrDefault(action);
                default:
                    return {};
            }
        }

        return events;
    }
}

interface FieldBindings {
    [action: string]: {
        [event: string]: EventConfig;
    };
}

interface EventConfig {
    argToValue: (e: any) => any;
    run: (value: any) => Promise<any>;
}

function getValueFromEvent(e: React.ChangeEvent<any> | any): any {
    if (e !== undefined && e !== null && e.currentTarget !== undefined && e.currentTarget.value !== undefined) {
        return e.currentTarget.value;
    }

    return e;
}
