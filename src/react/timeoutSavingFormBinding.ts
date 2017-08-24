import { FormEvent } from "react";
import { Action, Dispatch } from "redux";

import {
    FormActions,
    FormConfiguration,
    RdReduxFormBindingFactory
} from "../index";


export const timeoutSavingFormBinding = (): RdReduxFormBindingFactory<any, any> =>
    (config: FormConfiguration<any>, actions: FormActions<any>) =>
        (dispatch: Dispatch<Action>, meta: any) => {
            let timer: any;

            return ({
                $events: {
                    form: {
                        onChangeImmediately: (fieldName: string, value: any): void => {
                            dispatch(actions.fieldEdit(fieldName, value, meta));
                            dispatch(actions.fieldFormat(fieldName, meta));
                            dispatch(actions.validate(meta));
                        },
                    },
                    fields: Object.keys(config.fields).reduce((result: any, fieldName) => {
                        result[fieldName] = {
                            onChange(e: FormEvent<HTMLInputElement> | null, value: any): void {
                                if (timer) {
                                    clearTimeout(timer);
                                }

                                dispatch(actions.fieldEdit(fieldName, e !== null ? e.currentTarget.value : value));
                                timer = setTimeout(() => {
                                    dispatch(actions.fieldFormat(fieldName, meta));
                                    dispatch(actions.validate(meta));
                                }, 3000);
                            }
                        };

                        return result;
                    }, {}),
                }
            });
        };