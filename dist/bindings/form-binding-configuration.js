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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var field_binding_configuration_1 = require("./field-binding-configuration");
var FormBindingConfiguration = /** @class */ (function () {
    function FormBindingConfiguration() {
        this.fieldsConfig = {};
        this.validateFormOnSubmit = false;
    }
    /**
     * Specifies a form for the binidng configuration.
     *
     * @param form A form configuration for binidng
     */
    FormBindingConfiguration.prototype.withForm = function (form) {
        if (!form) {
            throw new Error("Form is not defined.");
        }
        this.form = form;
        return this;
    };
    FormBindingConfiguration.prototype.validateOnSubmit = function () {
        this.validateFormOnSubmit = true;
        return this;
    };
    /**
     * Configure bindings for all fields.
     */
    FormBindingConfiguration.prototype.forAllFields = function () {
        var _this = this;
        this.allFieldConfig = new field_binding_configuration_1.FieldBindingConfiguration();
        this.allFieldConfig.end = function () { return _this; };
        return this.allFieldConfig;
    };
    FormBindingConfiguration.prototype.configureFields = function (fieldsConfig) {
        if (!fieldsConfig) {
            throw new Error("Fields configuration is not defined.");
        }
        this.fieldsConfig = fieldsConfig(new field_binding_configuration_1.FieldBindingConfiguration());
        return this;
    };
    FormBindingConfiguration.prototype.bind = function (dispatch, meta) {
        var _this = this;
        if (!dispatch) {
            throw new Error("Dispatch function is not defined.");
        }
        if (!this.form) {
            throw new Error("Form is not attached to the binding config.");
        }
        var form = this.form;
        var fieldEvents = this.form.fields.reduce(function (result, field) {
            var bindingFactory = (_this.fieldsConfig || {})[field] || _this.allFieldConfig;
            result[field] = bindingFactory.build(form, field, dispatch, meta);
            return result;
        }, {});
        var formEvents = this.validateFormOnSubmit
            ? {
                onSubmit: function (e) {
                    e.preventDefault();
                    dispatch(form.actions.validate(meta));
                }
            }
            : {};
        return {
            connect: function (formSelectionResult) { return ({
                fields: Object.keys(formSelectionResult.fields).reduce(function (result, fieldName) {
                    var fieldInfo = formSelectionResult.fields[fieldName];
                    var events = fieldEvents[fieldName];
                    result[fieldName] = __assign({}, fieldInfo, { checkbox: function (checkedValue, uncheckedValue) {
                            if (checkedValue === void 0) { checkedValue = true; }
                            if (uncheckedValue === void 0) { uncheckedValue = false; }
                            var onChange = events.onChange, rest = __rest(events, ["onChange"]);
                            return __assign({}, rest, { checked: fieldInfo.value === checkedValue ? true : false, onChange: function (e) {
                                    if (e.currentTarget.type === "radio") {
                                        if (e.currentTarget.checked) {
                                            onChange(checkedValue);
                                        }
                                    }
                                    else {
                                        onChange(e.currentTarget.checked ? checkedValue : uncheckedValue);
                                    }
                                } });
                        }, events: events, input: function (replaceUndefinedOrNullValue, replaceWith) {
                            if (replaceWith === void 0) { replaceWith = ""; }
                            return (__assign({}, events, { value: (fieldInfo.value === undefined || fieldInfo.value === null) &&
                                    replaceUndefinedOrNullValue
                                    ? replaceWith
                                    : fieldInfo.value }));
                        }, multiCheckbox: function (value) {
                            var onChange = events.onChange, rest = __rest(events, ["onChange"]);
                            return __assign({}, rest, { onChange: function (e) {
                                    fieldEvents.onChange(e.currentTarget.checked
                                        ? (fieldInfo.value || []).concat([value]) : (fieldInfo.value || []).filter(function (el) { return el !== value; }));
                                } });
                        } });
                    return result;
                }, {}),
                formProps: formEvents
            }); },
            fields: fieldEvents,
            form: formEvents
        };
    };
    FormBindingConfiguration.prototype.default = function () {
        return this.validateOnSubmit()
            .forAllFields()
            .edit()
            .onChange()
            .startEditing()
            .onFocus()
            .endEditing()
            .onBlur()
            .end();
    };
    return FormBindingConfiguration;
}());
exports.FormBindingConfiguration = FormBindingConfiguration;
//# sourceMappingURL=form-binding-configuration.js.map