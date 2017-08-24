"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var RdReduxFormImpl = (function () {
    function RdReduxFormImpl(title, config) {
        this.title = title;
        this.config = config;
        this.actions = new FormActionsImpl(this.title);
        this.connect = this.createConnect();
        this.state = {
            /**
             * Gets the state for the form without data.
             */
            empty: function () {
                return {
                    fields: {},
                    touched: new Set(),
                    formatted: new Set(),
                    validated: false
                };
            },
            /**
             * Gets the state for the form with data.
             * Do the same thing as dispatching setData action with resetting, but can be used in reducer.
             */
            withData: function (data) {
                return {
                    fields: data,
                    touched: new Set(),
                    formatted: new Set(),
                    validated: false,
                    errors: undefined
                };
            }
        };
        if (!title) {
            throw new Error("Form title is not defined.");
        }
        if (!config) {
            throw new Error("Form configuraion is not defined.");
        }
    }
    RdReduxFormImpl.prototype.reducer = function (state, action) {
        state = state || this.state.empty();
        if (this.actions.isSetData(action)) {
            return __assign({}, state, { fields: action.data, touched: action.resetState ? new Set() : state.touched, formatted: action.resetState ? new Set() : state.formatted, validated: action.resetState ? false : state.validated, errors: action.resetState ? undefined : state.errors });
        }
        if (this.actions.isFieldEdit(action)) {
            state.formatted.delete(action.field);
            return __assign({}, state, { fields: __assign({}, state.fields, (_a = {}, _a[action.field] = action.value, _a)), touched: state.touched.add(action.field), formatted: new Set(state.formatted) });
        }
        if (this.actions.isFieldFormat(action)) {
            return __assign({}, state, { formatted: state.formatted.add(action.field) });
        }
        if (this.actions.isValidate(action)) {
            return __assign({}, state, { validated: true, touched: new Set(), formatted: new Set(), errors: undefined });
        }
        if (this.actions.isReset(action)) {
            return __assign({}, state, { validated: false, errors: undefined, touched: new Set(), formatted: new Set() });
        }
        if (this.actions.isSetErrors(action)) {
            return __assign({}, state, { errors: action.errors });
        }
        return state;
        var _a;
    };
    RdReduxFormImpl.prototype.selector = function (state) {
        var initialData = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            initialData[_i - 1] = arguments[_i];
        }
        state = state || this.state.empty();
        var initialValues = Object.assign.apply(Object, [{}].concat(initialData.concat([state.fields])));
        var parsedFields = utils_1.entries(this.config.fields)
            .reduce(function (result, _a) {
            var field = _a[0], config = _a[1];
            var parser = config.parser || (function (v) { return v; });
            var formatter = config.formatter || (function (v) { return (v === null || v === undefined || isNaN(v)) ? "" : "" + v; });
            var rawValue = initialValues[field];
            var parsedValue = parser(rawValue);
            if (parsedValue === undefined) {
                result[field] = {
                    value: rawValue || "",
                    formattedValue: rawValue,
                    isParsed: false,
                    errors: [config.parseError || "Value is not valid."],
                    visualState: "none"
                };
            }
            else {
                result[field] = {
                    value: rawValue || "",
                    formattedValue: formatter(parsedValue),
                    parsedValue: parsedValue,
                    isParsed: true,
                    visualState: "none"
                };
            }
            return result;
        }, {});
        var isAllParsed = utils_1.entries(parsedFields).every(function (_a) {
            var _ = _a[0], info = _a[1];
            return info.isParsed;
        });
        var data = utils_1.entries(parsedFields)
            .filter(function (_a) {
            var _ = _a[0], val = _a[1];
            return val.isParsed;
        })
            .reduce(function (result, _a) {
            var name = _a[0], val = _a[1];
            result[name] = val.parsedValue;
            return result;
        }, {});
        var hasExtraErrors = state.errors &&
            (!utils_1.isNullOrEmptyArray(state.errors.message) ||
                (state.errors.fields && utils_1.entries(state.errors.fields).some(function (_a) {
                    var _ = _a[0], err = _a[1];
                    return !utils_1.isNullOrEmptyArray(err);
                })));
        return {
            isValid: (isAllParsed && !hasExtraErrors) || !!state.touched.size,
            data: isAllParsed ? data : undefined,
            formError: state.errors ? state.errors.message : undefined,
            fields: utils_1.entries(parsedFields)
                .reduce(function (result, _a) {
                var name = _a[0], val = _a[1];
                var error = val.isParsed
                    ? state.errors && state.errors.fields && !utils_1.isNullOrEmptyArray(state.errors.fields[name])
                        ? state.errors.fields[name]
                        : undefined
                    : val.errors;
                var hasError = !val.isParsed || !utils_1.isNullOrEmptyArray(error);
                var showErrors = (!val.isParsed && state.formatted.has(name)) || (state.validated && !state.touched.has(name));
                result[name] = {
                    value: val.value,
                    isParsed: val.isParsed,
                    parsedValue: val.parsedValue,
                    formattedValue: val.formattedValue,
                    errors: hasError ? error : undefined,
                    visualState: showErrors
                        ? (hasError ? "invalid" : "valid")
                        : "none"
                };
                return result;
            }, {})
        };
    };
    RdReduxFormImpl.prototype.createConnect = function () {
        var self = this;
        var result = {
            stateToFields: function (state) { return self.selector(state); },
            dispatch: this.config.dispatch(this.config, this.actions)
        };
        return result;
    };
    return RdReduxFormImpl;
}());
exports.RdReduxFormImpl = RdReduxFormImpl;
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
    FormActionsImpl.prototype.setData = function (data, resetState, meta) {
        if (resetState === void 0) { resetState = false; }
        if (meta === void 0) { meta = undefined; }
        if (!data) {
            throw new Error("Data is not defined.");
        }
        return {
            type: this.makeActionType(SET_DATA),
            form: this.title,
            data: data,
            resetState: resetState,
            meta: meta
        };
    };
    FormActionsImpl.prototype.fieldEdit = function (field, value, meta) {
        if (meta === void 0) { meta = undefined; }
        if (!field) {
            throw new Error("Field is not defined.");
        }
        return {
            type: this.makeActionType(FIELD_EDIT),
            form: this.title,
            field: field,
            value: value,
            meta: meta
        };
    };
    FormActionsImpl.prototype.fieldFormat = function (field, meta) {
        if (meta === void 0) { meta = undefined; }
        if (!field) {
            throw new Error("Field is not defined.");
        }
        return {
            type: this.makeActionType(FIELD_FORMAT),
            form: this.title,
            field: field,
            meta: meta
        };
    };
    FormActionsImpl.prototype.validate = function (meta) {
        if (meta === void 0) { meta = undefined; }
        return {
            type: this.makeActionType(VALIDATE),
            form: this.title,
            meta: meta
        };
    };
    FormActionsImpl.prototype.setErrors = function (errors, meta) {
        if (meta === void 0) { meta = undefined; }
        return {
            type: this.makeActionType(SET_ERRORS),
            form: this.title,
            errors: errors,
            meta: meta
        };
    };
    FormActionsImpl.prototype.resetErrors = function (meta) {
        if (meta === void 0) { meta = undefined; }
        return this.setErrors(meta);
    };
    FormActionsImpl.prototype.reset = function (meta) {
        if (meta === void 0) { meta = undefined; }
        return {
            type: this.makeActionType(RESET),
            form: this.title,
            meta: meta
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
//# sourceMappingURL=RdReduxForm.js.map