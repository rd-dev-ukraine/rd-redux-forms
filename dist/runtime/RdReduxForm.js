"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var FormActionsImpl_1 = require("./FormActionsImpl");
var RdReduxFormImpl = /** @class */ (function () {
    function RdReduxFormImpl(title, fieldConfiguration) {
        this.title = title;
        this.fieldConfiguration = fieldConfiguration;
        this.types = {
            get fields() {
                throw new Error("Use with Typescript typeof expression only.");
            },
            get meta() {
                throw new Error("Use with Typescript typeof expression only.");
            },
            get state() {
                throw new Error("Use with Typescript typeof expression only.");
            },
            get eventBindings() {
                throw new Error("Use with Typescript typeof expression only.");
            },
            get selectorResult() {
                throw new Error("Use with Typescript typeof expression only.");
            }
        };
        this.fields = [];
        this.actions = new FormActionsImpl_1.FormActionsImpl(this.title);
        this.state = {
            /**
             * Gets the state for the form without data.
             */
            empty: function () {
                return {
                    fields: {},
                    formatted: new Set(),
                    touched: new Set(),
                    validated: false
                };
            },
            /**
             * Gets the state for the form with data.
             * Do the same thing as dispatching setData action with resetting, but can be used in reducer.
             */
            withData: function (data) {
                return {
                    errors: undefined,
                    fields: data,
                    formatted: new Set(),
                    touched: new Set(),
                    validated: false
                };
            }
        };
        if (!title) {
            throw new Error("Form title is not defined.");
        }
        if (!fieldConfiguration) {
            throw new Error("Form field configuraion is not defined.");
        }
        this.fields = Object.keys(fieldConfiguration);
    }
    RdReduxFormImpl.prototype.reducer = function (state, action) {
        var _a;
        state = state || this.state.empty();
        if (this.actions.isSetData(action)) {
            return __assign({}, state, { errors: action.resetState ? undefined : state.errors, fields: action.data, formatted: action.resetState ? new Set() : state.formatted, touched: action.resetState ? new Set() : state.touched, validated: action.resetState ? false : state.validated });
        }
        if (this.actions.isFieldEdit(action)) {
            state.formatted.delete(action.field);
            return __assign({}, state, { fields: __assign({}, state.fields, (_a = {}, _a[action.field] = action.value, _a)), formatted: new Set(state.formatted), touched: state.touched.add(action.field) });
        }
        if (this.actions.isFieldFormat(action)) {
            return __assign({}, state, { formatted: state.formatted.add(action.field) });
        }
        if (this.actions.isValidate(action)) {
            return __assign({}, state, { errors: undefined, formatted: new Set(), touched: new Set(), validated: true });
        }
        if (this.actions.isReset(action)) {
            return __assign({}, state, { errors: undefined, formatted: new Set(), touched: new Set(), validated: false });
        }
        if (this.actions.isSetErrors(action)) {
            return __assign({}, state, { errors: action.errors });
        }
        return state;
    };
    RdReduxFormImpl.prototype.selector = function (state) {
        var _this = this;
        var initialData = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            initialData[_i - 1] = arguments[_i];
        }
        state = state || this.state.empty();
        var initialValues = Object.assign.apply(Object, [{}].concat(initialData.concat([state.fields])));
        var fields = Object.keys(this.fieldConfiguration).map(function (n) {
            var fieldName = n;
            var fieldConfig = _this.fieldConfiguration[fieldName];
            var parser = fieldConfig.parser || (function (v) { return v; });
            var formatter = fieldConfig.formatter || (function (v) { return (v === null || v === undefined || isNaN(v) ? "" : "" + v); });
            var rawValue = initialValues[fieldName];
            var showErrors = state.formatted.has(fieldName) ||
                (state.validated && !state.touched.has(fieldName));
            try {
                var parsedValue = parser(rawValue);
                // Successfully parsed
                var customErrors = !!state.errors &&
                    !!state.errors.fields &&
                    !!state.errors.fields[fieldName] &&
                    !!state.errors.fields[fieldName].length
                    ? state.errors.fields[fieldName]
                    : undefined;
                if (customErrors) {
                    // Parsed but has custom error set field
                    var field = {
                        errors: customErrors,
                        data: parsedValue,
                        hasErrors: true,
                        isParsed: true,
                        value: formatter(parsedValue),
                        visualState: showErrors ? "invalid" : "none"
                    };
                    return [fieldName, field];
                }
                else {
                    // Valid field info
                    var field = {
                        value: formatter(parsedValue),
                        hasErrors: false,
                        isParsed: true,
                        data: parsedValue,
                        visualState: showErrors ? "valid" : "none"
                    };
                    return [fieldName, field];
                }
            }
            catch (e) {
                var field = {
                    errors: [e.message],
                    hasErrors: true,
                    isParsed: false,
                    value: rawValue,
                    visualState: showErrors ? "invalid" : "none"
                };
                return [fieldName, field];
            }
        });
        var isFormValid = fields.every(function (_a) {
            var _ = _a[0], field = _a[1];
            return !field.hasErrors;
        });
        var hasFormError = state.errors && state.errors.message && state.errors.message.length;
        if (!isFormValid || hasFormError) {
            var formInfo = {
                fields: fields.reduce(function (result, _a) {
                    var fieldName = _a[0], field = _a[1];
                    result[fieldName] = field;
                    return result;
                }, {}),
                formError: hasFormError && state.errors ? state.errors.message : undefined,
                isParsed: fields.every(function (_a) {
                    var name = _a[0], field = _a[1];
                    return field.isParsed;
                }),
                isValid: false
            };
            return formInfo;
        }
        else {
            var formInfo = {
                data: fields.reduce(function (result, _a) {
                    var fieldName = _a[0], field = _a[1];
                    if (field.isParsed) {
                        result[fieldName] = field.data;
                    }
                    return result;
                }, {}),
                fields: fields.reduce(function (result, _a) {
                    var fieldName = _a[0], field = _a[1];
                    result[fieldName] = field;
                    return result;
                }, {}),
                isValid: true
            };
            return formInfo;
        }
    };
    return RdReduxFormImpl;
}());
exports.RdReduxFormImpl = RdReduxFormImpl;
//# sourceMappingURL=RdReduxForm.js.map