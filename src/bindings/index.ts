export * from "./configuration";
import { AnyFormBindingConfiguration } from "./configuration";
import { FormBindingConfiguration } from "./form-binding-configuration";

export function reactBinding(): AnyFormBindingConfiguration {
    return new FormBindingConfiguration();
}
