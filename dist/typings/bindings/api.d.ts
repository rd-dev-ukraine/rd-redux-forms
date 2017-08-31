import { Dispatch } from "redux";
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
