import { Dispatch } from "redux";
import { RdReduxForm } from "../../api";
import { FieldEventBindings, FormEventBindings } from "./RdEventBindings";

export interface RdEventBindingsConfiguration<TFields, TMeta> {
    form: FormEventBindingFactory<TFields, TMeta>;
    fields: { [TField in keyof TField]?: FieldEventBindingFactory<TFields, TMeta> };
    allFields?: FieldEventBindingFactory<TFields, TMeta>;
}

export type FormEventBindingFactory<TFields, TMeta> = (
    form: RdReduxForm<TFields, TMeta>,
    dispatch: Dispatch,
    meta: TMeta
) => FormEventBindings;

export type FieldEventBindingFactory<TFields, TMeta> = (
    form: RdReduxForm<TFields, TMeta>,
    dispatch: Dispatch,
    meta: TMeta,
    fieldName: string
) => FieldEventBindings;
