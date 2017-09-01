import { FieldBindingConfiguration } from "./field-binding-configuration";
import { FormBindingConfiguration } from "./form-binding-configuration";

export const reactBinding = new FormBindingConfiguration();

export function field(): FieldBindingConfiguration {
    return new FieldBindingConfiguration();
}
