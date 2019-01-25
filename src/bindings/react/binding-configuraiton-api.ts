import { RdReduxForm } from "../../api";

export type RdReduxFormBindingFactory<TFields, TMeta> = (
    form: RdReduxForm<TFields, TMeta>
) => RdReduxFormBindingConfiguration<TFields, TMeta>;

export interface RdReduxFormBindingConfiguration<TFields, TMeta> {}
