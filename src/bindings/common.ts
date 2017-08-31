import { FormActions } from "../";

export interface BindingConfiguration<TForm, TMeta> {
    mergeFormBindings(bindings: FormBindingFactory<TForm, TMeta>): void;
    replaceFormBindings(binding: FormBindingFactory<TForm, TMeta>): void;

    mergeFieldsBindings(bindings: {
        [P in keyof TForm]: FieldBindingFactory<TForm, TMeta>;
    }): void;
    replaceFieldsBindings(bindings: {
        [P in keyof TForm]: FieldBindingFactory<TForm, TMeta>;
    }): void;
}

export type FormBindingFactory<TForm, TMeta> = (form: FormActions<TForm, TMeta>, meta: TMeta) => PropertyHash;
export type FieldBindingFactory<TForm, TMeta> =
    (field: keyof TForm, form: FormActions<TForm, TMeta>, meta: TMeta) => PropertyHash;
export interface PropertyHash { [prop: string]: any; }
