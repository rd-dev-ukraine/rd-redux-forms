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
var VisualStateCalc_1 = require("./VisualStateCalc");
var formCounter = 0;
var RdReduxFormImpl = /** @class */ (function () {
    function RdReduxFormImpl(title, fieldConfiguration) {
        var _this = this;
        this.title = title;
        this.fieldConfiguration = fieldConfiguration;
        this.id = "" + ++formCounter;
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
                    editing: {},
                    fields: {},
                    touched: {},
                    validated: false
                };
            },
            /**
             * Gets the state for the form with data.
             * Do the same thing as dispatching setData action with resetting, but can be used in reducer.
             */
            withData: function (data) {
                return {
                    editing: {},
                    fields: data,
                    touched: {},
                    validated: false
                };
            }
        };
        this.reducer = function (state, action) {
            var _a, _b, _c;
            state = state || _this.state.empty();
            if (_this.actions.isSetData(action)) {
                return __assign({}, state, { editing: action.resetState ? {} : state.editing, errors: action.resetState ? undefined : state.errors, fields: action.data, touched: action.resetState ? {} : state.touched, validated: action.resetState ? false : state.validated });
            }
            if (_this.actions.isFieldEdit(action)) {
                return __assign({}, state, { fields: __assign({}, state.fields, (_a = {}, _a[action.field] = action.value, _a)), touched: __assign({}, state.touched, (_b = {}, _b[action.field] = true, _b)) });
            }
            if (_this.actions.isFieldStartEditing(action)) {
                return __assign({}, state, { editing: __assign({}, state.editing, (_c = {}, _c[action.field] = true, _c)) });
            }
            if (_this.actions.isFieldEndEditing(action)) {
                var editing = __assign({}, state.editing);
                delete editing[action.field];
                return __assign({}, state, { editing: editing });
            }
            if (_this.actions.isValidate(action)) {
                return __assign({}, state, { errors: state.errors, formatted: {}, touched: {}, validated: true });
            }
            if (_this.actions.isReset(action)) {
                return __assign({}, state, { errors: undefined, formatted: {}, touched: {}, validated: false });
            }
            if (_this.actions.isSetErrors(action)) {
                return __assign({}, state, { errors: action.errors, formatted: {}, touched: {}, validated: true });
            }
            return state;
        };
        this.selector = function (state) {
            var initialData = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                initialData[_i - 1] = arguments[_i];
            }
            state = state || _this.state.empty();
            var formValues = Object.assign.apply(Object, [{}].concat(initialData.concat([state.fields])));
            var fields = Object.keys(_this.fieldConfiguration).map(function (n) {
                var fieldName = n;
                var fieldConfig = _this.fieldConfiguration[fieldName];
                var parser = fieldConfig.parser || (function (v) { return v; });
                var formatter = fieldConfig.formatter || (function (v) { return (v === null || v === undefined || isNaN(v) ? "" : "" + v); });
                var rawValue = formValues[fieldName];
                var isFieldEditing = !!state.editing[fieldName];
                var isFieldTouched = !!state.touched[fieldName];
                // Successfully parsed
                var fieldCustomErrors = !!state.errors &&
                    !!state.errors.fields &&
                    !!state.errors.fields[fieldName] &&
                    !!state.errors.fields[fieldName].length
                    ? state.errors.fields[fieldName]
                    : undefined;
                try {
                    var parsedValue = parser(rawValue);
                    if (fieldCustomErrors) {
                        // Parsed but has custom error set field
                        var field = {
                            data: parsedValue,
                            errors: fieldCustomErrors,
                            hasCustomErrors: true,
                            isParsed: true,
                            value: isFieldEditing ? rawValue : formatter(parsedValue),
                            visualState: VisualStateCalc_1.CalculateVisualStateStrategies.default(state.validated, true, true, isFieldTouched, isFieldEditing)
                        };
                        return [fieldName, field];
                    }
                    else {
                        // Valid field info
                        var field = {
                            data: parsedValue,
                            hasCustomErrors: false,
                            isParsed: true,
                            value: isFieldEditing ? rawValue : formatter(parsedValue),
                            visualState: VisualStateCalc_1.CalculateVisualStateStrategies.default(state.validated, true, false, isFieldTouched, isFieldEditing)
                        };
                        return [fieldName, field];
                    }
                }
                catch (e) {
                    var field = {
                        errors: [e.message].concat((fieldCustomErrors || [])),
                        hasCustomErrors: !!fieldCustomErrors,
                        isParsed: false,
                        value: rawValue,
                        visualState: VisualStateCalc_1.CalculateVisualStateStrategies.default(state.validated, false, !!fieldCustomErrors, isFieldTouched, isFieldEditing)
                    };
                    return [fieldName, field];
                }
            });
            var isFormValid = fields.every(function (_a) {
                var _ = _a[0], f = _a[1];
                return f.isParsed;
            });
            var hasFormError = state.errors && state.errors.message && state.errors.message.length;
            if (!isFormValid) {
                var formInfo = {
                    customFormError: hasFormError && state.errors ? state.errors.message : undefined,
                    fields: fields.reduce(function (result, _a) {
                        var fieldName = _a[0], f = _a[1];
                        result[fieldName] = f;
                        return result;
                    }, {}),
                    hasCustomErrors: !!hasFormError || fields.some(function (_a) {
                        var _ = _a[0], f = _a[1];
                        return f.hasCustomErrors;
                    }),
                    isValid: false
                };
                return formInfo;
            }
            else {
                var formInfo = {
                    data: fields.reduce(function (result, _a) {
                        var fieldName = _a[0], f = _a[1];
                        if (f.isParsed) {
                            result[fieldName] = f.data;
                        }
                        return result;
                    }, {}),
                    fields: fields.reduce(function (result, _a) {
                        var fieldName = _a[0], f = _a[1];
                        result[fieldName] = f;
                        return result;
                    }, {}),
                    hasCustomErrors: !!hasFormError || fields.some(function (_a) {
                        var _ = _a[0], f = _a[1];
                        return f.hasCustomErrors;
                    }),
                    isValid: true
                };
                return formInfo;
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
    return RdReduxFormImpl;
}());
exports.RdReduxFormImpl = RdReduxFormImpl;
//# sourceMappingURL=RdReduxForm.js.map