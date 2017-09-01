export * from "./configuration";
import { AnyFormBindingConfiguration } from "./configuration";
import { FieldBindingConfiguration } from "./field-binding-configuration";
import { FormBindingConfiguration } from "./form-binding-configuration";

export const reactBinding: AnyFormBindingConfiguration = new FormBindingConfiguration();

export function field(): FieldBindingConfiguration {
    return new FieldBindingConfiguration();
}
