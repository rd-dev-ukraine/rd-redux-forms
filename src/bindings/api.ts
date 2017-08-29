import { Dispatch } from "redux";

import { FormActions } from "../";

/** An property bindings (usually event handlers) for form and inputs. */
export interface RdReduxFormBindings<TForm> {
    /** An event handlers for a <form> tag */
    form: any;

    /** An event handlers for each field input. */
    fields: {
        [P in keyof TForm]: any;
    };
}

/** Creates a rd-redux-form bindings. */
export interface BindingFactory<TForm, TMeta> {
    /**
     * Creates an object ready to spread into the result of the mapDispatchToProperties
     * argument of the connect in case if
     * returning object is chosen.
     *
     * @param meta A meta object passed with each dispatched action.
     */
    bind(meta: TMeta): RdReduxFormBindings<TForm>;

    /**
     * Creates an object ready to spreat into the result of the mapDispatchToProperties
     * argument of the connect call in case if
     * variant accepts the dispatch is chosen.
     *
     * @param dispatch Dispatch function.
     * @param meta A meta object passed with each dispatched action.
     */
    bindDispatch(dispatch: Dispatch<any>, meta: TMeta): RdReduxFormBindings<TForm>;
}

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
