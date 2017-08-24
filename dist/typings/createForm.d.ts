import { FormConfiguration, RdReduxForm } from "./api";
export declare function createForm<TFields, TMeta = undefined>(title: string, config: FormConfiguration<TFields, TMeta>): RdReduxForm<TFields, TMeta>;
