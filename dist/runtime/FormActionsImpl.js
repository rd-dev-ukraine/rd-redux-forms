"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SET_DATA = "SET_DATA";
var FIELD_EDIT = "EDIT_FIELD";
var FIELD_FORMAT = "FORMAT_FIELD";
var VALIDATE = "VALIDATE";
var RESET = "RESET";
var SET_ERRORS = "SET_ERRORS";
var FormActionsImpl = (function () {
    function FormActionsImpl(title) {
        this.title = title;
    }
    FormActionsImpl.prototype.fieldEdit = function (field, value, meta) {
        if (meta === void 0) { meta = undefined; }
        if (!field) {
            throw new Error("Field is not defined.");
        }
        return {
            field: field,
            form: this.title,
            meta: meta,
            type: this.makeActionType(FIELD_EDIT),
            value: value,
        };
    };
    FormActionsImpl.prototype.fieldFormat = function (field, meta) {
        if (meta === void 0) { meta = undefined; }
        if (!field) {
            throw new Error("Field is not defined.");
        }
        return {
            field: field,
            form: this.title,
            meta: meta,
            type: this.makeActionType(FIELD_FORMAT),
        };
    };
    FormActionsImpl.prototype.setData = function (data, resetState, meta) {
        if (resetState === void 0) { resetState = false; }
        if (meta === void 0) { meta = undefined; }
        if (!data) {
            throw new Error("Data is not defined.");
        }
        return {
            data: data,
            form: this.title,
            meta: meta,
            resetState: resetState,
            type: this.makeActionType(SET_DATA)
        };
    };
    FormActionsImpl.prototype.validate = function (meta) {
        if (meta === void 0) { meta = undefined; }
        return {
            form: this.title,
            meta: meta,
            type: this.makeActionType(VALIDATE)
        };
    };
    FormActionsImpl.prototype.setErrors = function (errors, meta) {
        if (meta === void 0) { meta = undefined; }
        return {
            errors: errors,
            form: this.title,
            meta: meta,
            type: this.makeActionType(SET_ERRORS)
        };
    };
    FormActionsImpl.prototype.resetErrors = function (meta) {
        if (meta === void 0) { meta = undefined; }
        return this.setErrors(meta);
    };
    FormActionsImpl.prototype.reset = function (meta) {
        if (meta === void 0) { meta = undefined; }
        return {
            form: this.title,
            meta: meta,
            type: this.makeActionType(RESET)
        };
    };
    FormActionsImpl.prototype.isSetData = function (action) {
        return !!action && action.type === this.makeActionType(SET_DATA);
    };
    FormActionsImpl.prototype.isFieldEdit = function (action) {
        return !!action && action.type === this.makeActionType(FIELD_EDIT);
    };
    FormActionsImpl.prototype.isFieldFormat = function (action) {
        return !!action && action.type === this.makeActionType(FIELD_FORMAT);
    };
    FormActionsImpl.prototype.isValidate = function (action) {
        return !!action && action.type === this.makeActionType(VALIDATE);
    };
    FormActionsImpl.prototype.isReset = function (action) {
        return !!action && action.type === this.makeActionType(RESET);
    };
    FormActionsImpl.prototype.isSetErrors = function (action) {
        return !!action && action.type === this.makeActionType(SET_ERRORS);
    };
    FormActionsImpl.prototype.isMyAction = function (action) {
        if (action && ("" + action.type).indexOf(this.actionPrefix()) === 0) {
            return action.form === this.title;
        }
        return false;
    };
    FormActionsImpl.prototype.makeActionType = function (action) {
        if (!action) {
            throw new Error("Action is not defined.");
        }
        return this.actionPrefix() + " " + action.toLowerCase();
    };
    FormActionsImpl.prototype.actionPrefix = function () {
        return "RD-FORM :: " + this.title + " ::";
    };
    return FormActionsImpl;
}());
exports.FormActionsImpl = FormActionsImpl;
//# sourceMappingURL=FormActionsImpl.js.map