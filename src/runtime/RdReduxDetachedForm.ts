import { Action } from "redux";
import { RdReduxDetachedForm, RdReduxForm, ReduxFormState } from "../api";
import { BindingFactory, FormBindings } from "../bindings";

export class RdReduxDetachedFormImpl<TFields> implements RdReduxDetachedForm<TFields> {
    private state: ReduxFormState<TFields>;
    private readonly bindings: FormBindings<TFields>;

    constructor(private form: RdReduxForm<TFields, any>, bindings: BindingFactory<TFields, any>) {
        if (!form) {
            throw new Error("Form were not provided");
        }
        if (!bindings) {
            throw new Error("Form bindings were not provided");
        }

        this.state = this.form.state.empty();

        this.bindings = bindings.bind(this.dispatch, {});
    }

    fields = (...initialData: Partial<TFields>[]) => this.form.selector(this.state, ...initialData);

    get events() {
        return this.bindings.fields;
    }

    private dispatch = (action: Action): void => {
        if (this.form.actions.isMyAction(action)) {
            this.state = this.form.reducer(this.state, action);
        }
    };
}
