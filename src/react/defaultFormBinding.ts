import { FormEvent } from "react";
import { Action, Dispatch } from "redux";

import {
    FormActions,
    FormConfiguration,
    RdReduxFormBindingFactory
} from "../api";


export const defaultFormBinding = (): RdReduxFormBindingFactory<any, any> =>
    (config: FormConfiguration<any>, actions: FormActions<any>) =>
        (dispatch: Dispatch<Action>, meta: any) => ({
            $events: {
                form: {
                    onSubmit(e: FormEvent<HTMLFormElement>): void {
                        e.preventDefault();

                        dispatch(actions.validate(meta));
                    }
                },
                fields: Object.keys(config.fields).reduce((result: any, fieldName) => {
                    result[fieldName] = {
                        onChange(e: FormEvent<HTMLInputElement> | null, value: any): void {
                            dispatch(actions.fieldEdit(fieldName, e !== null ? e.currentTarget.value : value, meta));
                        },
                        onBlur(): void {
                            dispatch(actions.fieldFormat(fieldName, meta));
                        }
                    };

                    return result;
                }, {})
            }
        });