import { FieldEditAction, FieldEndEditingAction, FieldStartEditingAction, FormActions, FormResetAction, FormSetDataAction, FormSetErrorsAction, FormValidateAction } from "../api";
export declare const formActionHelper: {
    deriveAction<TFields, TMeta>(action: FieldEditAction<TFields, TMeta> | FieldStartEditingAction<TFields, TMeta> | FieldEndEditingAction<TFields, TMeta> | FormValidateAction<TMeta> | FormResetAction<TMeta> | FormSetDataAction<TFields, TMeta> | FormSetErrorsAction<TFields, TMeta>): FormActions<TFields, TMeta>;
};
