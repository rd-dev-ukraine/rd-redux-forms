import { FormFieldsConfiguration, RdReduxForm } from "./api";
export declare function createForm<TFields, TMeta = undefined>(title: string, fields: FormFieldsConfiguration<TFields>): RdReduxForm<TFields, TMeta>;
