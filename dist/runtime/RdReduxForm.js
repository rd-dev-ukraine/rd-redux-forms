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
var FormActionsImpl_1 = require("./FormActionsImpl");
var RdReduxFormImpl = (function () {
    function RdReduxFormImpl(title, config) {
        this.title = title;
        this.config = config;
        this.actions = new FormActionsImpl_1.FormActionsImpl(this.title);
        this.connect = this.createConnect();
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
        if (!config) {
            throw new Error("Form configuraion is not defined.");
        }
    }
    RdReduxFormImpl.prototype.reducer = function (state, action) {
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
            var formatter = config.formatter ||
                (function (v) { return (v === null || v === undefined || isNaN(v)) ? "" : "" + v; });
            var rawValue = initialValues[field];
            var parsedValue = parser(rawValue);
            if (parsedValue === undefined) {
                result[field] = {
                    errors: [config.parseError || "Value is not valid."],
                    formattedValue: rawValue,
                    isParsed: false,
                    value: rawValue || "",
                    visualState: "none"
                };
            }
            else {
                result[field] = {
                    formattedValue: formatter(parsedValue),
                    isParsed: true,
                    parsedValue: parsedValue,
                    value: rawValue || "",
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
                (state.errors.fields &&
                    utils_1.entries(state.errors.fields).some(function (_a) {
                        var _ = _a[0], err = _a[1];
                        return !utils_1.isNullOrEmptyArray(err);
                    })));
        return {
            data: isAllParsed ? data : undefined,
            fields: utils_1.entries(parsedFields)
                .reduce(function (result, _a) {
                var name = _a[0], val = _a[1];
                var error = val.isParsed
                    ? state.errors && state.errors.fields && !utils_1.isNullOrEmptyArray(state.errors.fields[name])
                        ? state.errors.fields[name]
                        : undefined
                    : val.errors;
                var hasError = !val.isParsed || !utils_1.isNullOrEmptyArray(error);
                var showErrors = (!val.isParsed && state.formatted.has(name)) ||
                    (state.validated && !state.touched.has(name));
                result[name] = {
                    errors: hasError ? error : undefined,
                    formattedValue: val.formattedValue,
                    isParsed: val.isParsed,
                    parsedValue: val.parsedValue,
                    value: val.value,
                    visualState: showErrors
                        ? (hasError ? "invalid" : "valid")
                        : "none"
                };
                return result;
            }, {}),
            formError: state.errors ? state.errors.message : undefined,
            isValid: (isAllParsed && !hasExtraErrors) || !!state.touched.size
        };
    };
    RdReduxFormImpl.prototype.createConnect = function () {
        var self = this;
        var result = {
            dispatch: this.config.dispatch(this.config, this.actions),
            stateToFields: function (state) { return self.selector(state); }
        };
        return result;
    };
    return RdReduxFormImpl;
}());
exports.RdReduxFormImpl = RdReduxFormImpl;
//# sourceMappingURL=RdReduxForm.js.map