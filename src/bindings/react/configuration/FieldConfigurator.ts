import { RdReduxForm } from "../../../api";
import { FieldEventBindingFactory } from "../api";

export interface FieldEventBindingConfigurator<TFields, TMeta> extends FieldEventBindingFactory<TFields, TMeta> {
    submitOn(events: FieldActionEvents): this;
    editOn(events: FieldActionEvents): this;
    startEditingOn(events: FieldActionEvents): this;
    endEditingOn(events: FieldActionEvents): this;
}

export type FieldActionEvents = (events: ReactEventConfigurator) => EventConfiguration[];

export interface ReactEventConfigurator {
    onFocus(getValue?: EventValueAccessor<React.FocusEvent<any>>): EventConfiguration;
    onBlur(getValue?: EventValueAccessor<React.FocusEvent<any>>): EventConfiguration;
    onChange(getValue?: EventValueAccessor<React.ChangeEvent<any>>): EventConfiguration;
}

export type EventValueAccessor<TEvent> = (e: TEvent) => any;

export interface EventConfiguration {
    name: string;
    getValue?: EventValueAccessor<any>;
}

const a: FieldEventBindingConfigurator<{ a: string; b: number }, {}> = {} as any;

a.submitOn((e) => [e.onBlur()]).editOn((e) => [e.onChange(), e.onFocus()]);

// This should be a field event binding factory
const defaultFieldConfigurator: FieldEventBindingFactory<any, any> = (
    form: RdReduxForm<any, any>,
    dispatch,
    meta,
    fieldName
) => ({
    onBlur: () => dispatch(form.actions.fieldEndEditing(fieldName, meta)),
    onChange: (e: any) => dispatch(form.actions.fieldEdit(fieldName, getValueFromEvent(e), meta)),
    onFocus: () => dispatch(form.actions.fieldStartEditing(fieldName, meta))
});

function getValueFromEvent(e: React.ChangeEvent<any> | any): any {
    if (e !== undefined && e.currentTarget !== undefined && e.currentTarget.value !== undefined) {
        return e.currentTarget.value;
    }

    return e;
}
