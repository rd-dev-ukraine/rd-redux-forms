"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormActionsImpl = /** @class */ (function () {
    function FormActionsImpl(title) {
        var _this = this;
        this.title = title;
        this.fieldEdit = function (field, value, meta) {
            if (meta === void 0) { meta = undefined; }
            if (!field) {
                throw new Error("Field is not defined.");
            }
            return { field: field, form: _this.title, meta: meta, type: _this.types.FIELD_EDIT, value: value };
        };
        this.fieldStartEditing = function (field, meta) {
            if (meta === void 0) { meta = undefined; }
            if (!field) {
                throw new Error("Field is not defined.");
            }
            return { field: field, form: _this.title, meta: meta, type: _this.types.FIELD_START_EDITING };
        };
        this.fieldEndEditing = function (field, meta) {
            if (meta === void 0) { meta = undefined; }
            if (!field) {
                throw new Error("Field is not defined.");
            }
            return { field: field, form: _this.title, meta: meta, type: _this.types.FIELD_END_EDITING };
        };
        this.setData = function (data, resetState, meta) {
            if (resetState === void 0) { resetState = false; }
            if (meta === void 0) { meta = undefined; }
            if (!data) {
                throw new Error("Data is not defined.");
            }
            return { data: data, form: _this.title, meta: meta, resetState: resetState, type: _this.types.SET_DATA };
        };
        /**
         * Sets the values for the selected fields and optionally resets state for provided fields only.
         */
        this.resetFieldState = function (fields, meta) {
            if (meta === void 0) { meta = undefined; }
            return {
                fields: fields,
                form: _this.title,
                meta: meta,
                type: _this.types.RESET_FIELD_STATE
            };
        };
        this.validate = function (meta) {
            if (meta === void 0) { meta = undefined; }
            return { form: _this.title, meta: meta, type: _this.types.VALIDATE };
        };
        this.setErrors = function (errors, meta) {
            if (meta === void 0) { meta = undefined; }
            return { errors: errors, form: _this.title, meta: meta, type: _this.types.SET_ERRORS };
        };
        this.resetErrors = function (meta) {
            if (meta === void 0) { meta = undefined; }
            return _this.setErrors(undefined, meta);
        };
        this.reset = function (meta) {
            if (meta === void 0) { meta = undefined; }
            return { form: _this.title, meta: meta, type: _this.types.RESET };
        };
        this.isSetData = function (action) {
            return !!action && action.type === _this.types.SET_DATA;
        };
        this.isResetFieldState = function (action) {
            return !!action && action.type === _this.types.RESET_FIELD_STATE;
        };
        this.isFieldEdit = function (action) {
            return !!action && action.type === _this.types.FIELD_EDIT;
        };
        this.isFieldStartEditing = function (action) {
            return !!action && action.type === _this.types.FIELD_START_EDITING;
        };
        this.isFieldEndEditing = function (action) {
            return !!action && action.type === _this.types.FIELD_END_EDITING;
        };
        this.isValidate = function (action) {
            return !!action && action.type === _this.types.VALIDATE;
        };
        this.isReset = function (action) {
            return !!action && action.type === _this.types.RESET;
        };
        this.isSetErrors = function (action) {
            return !!action && action.type === _this.types.SET_ERRORS;
        };
        this.isMyAction = function (action) {
            if (action && ("" + action.type).indexOf(_this.actionPrefix()) === 0) {
                return action.form === _this.title;
            }
            return false;
        };
        this.makeActionType = function (action) {
            if (!action) {
                throw new Error("Action is not defined.");
            }
            return _this.actionPrefix() + " " + action.toLowerCase();
        };
        this.actionPrefix = function () {
            return "RD-FORM :: " + _this.title + " ::";
        };
        // tslint:disable-next-line:member-ordering
        this.types = {
            FIELD_EDIT: this.makeActionType("EDIT_FIELD"),
            FIELD_END_EDITING: this.makeActionType("END_FIELD_EDITING"),
            FIELD_START_EDITING: this.makeActionType("START_FIELD_EDITING"),
            RESET: this.makeActionType("RESET"),
            SET_DATA: this.makeActionType("SET_DATA"),
            RESET_FIELD_STATE: this.makeActionType("RESET_FIELD_STATE"),
            SET_ERRORS: this.makeActionType("SET_ERRORS"),
            VALIDATE: this.makeActionType("VALIDATE")
        };
    }
    return FormActionsImpl;
}());
exports.FormActionsImpl = FormActionsImpl;
//# sourceMappingURL=FormActionsImpl.js.map