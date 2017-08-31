import * as React from "react";

import {
    ActionTriggerConfigurationBuilder,
    FieldActionConfigurationBuilder,
    TriggerConfigurationBuilder
} from "../configuration";
import { EventConfigBuilder } from "./event-config-builder";

export class FormBindingConfiguration implements
    FieldActionConfigurationBuilder,
    ActionTriggerConfigurationBuilder,
    TriggerConfigurationBuilder {

    private defaultFieldBinding = new EventConfigBuilder();

    private lastAction: keyof FieldActionConfigurationBuilder;
    private lastEvent: string;

    submit(): this {
        this.lastAction = "submit";
        this.defaultFieldBinding.add(
            this.lastAction,
            "submit",
            (e) => undefined,
            true
        );

        return this;
    }

    format(): this {
        this.lastAction = "format";
        return this.onBlur(true);
    }

    unformat(): this {
        this.lastAction = "unformat";
        return this.onFocus(true);
    }

    edit(): this {
        this.lastAction = "edit";
        return this.onChange(true);
    }

    onChange(isDefault = false): this {
        return this.onEvent(
            "onChange",
            (e: React.ChangeEvent<any>) => e.currentTarget.value,
            isDefault
        );
    }

    onFocus(isDefault = false): this {
        return this.onEvent(
            "onFocus",
            (e: React.ChangeEvent<any>) => e.currentTarget.value,
            isDefault
        );
    }

    onBlur(isDefault = false): this {
        return this.onEvent(
            "onBlur",
            (e: React.ChangeEvent<any>) => e.currentTarget.value,
            isDefault
        );
    }

    onEvent<T>(event: string, argParser: (event: T) => any, isDefault: boolean = false): this {
        this.lastEvent = event;

        this.defaultFieldBinding.add(
            this.lastAction,
            this.lastEvent,
            argParser,
            isDefault
        );

        return this;
    }

    throttle(timeout: number): FieldActionConfigurationBuilder {
        return this;
    }

}
