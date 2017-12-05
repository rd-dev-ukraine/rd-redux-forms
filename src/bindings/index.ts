export * from "./configuration";
import { AnyFormBindingConfiguration } from "./configuration";
import { FieldBindingConfiguration } from "./field-binding-configuration";
import { FormBindingConfiguration } from "./form-binding-configuration";

export function reactBinding(): AnyFormBindingConfiguration {
    return new FormBindingConfiguration();
}

export function field(): FieldBindingConfiguration {
    return new FieldBindingConfiguration();
}
