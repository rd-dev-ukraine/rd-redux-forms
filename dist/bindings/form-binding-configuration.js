"use strict";
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
        this.fieldsConfig = fieldsConfig;
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
        var fields = this.form.fields.reduce(function (result, field) {
            var bindingFactory = (_this.fieldsConfig || {})[field] || _this.allFieldConfig;
            result[field] = bindingFactory.build(form, field, dispatch, meta);
            return result;
        }, {});
        return {
            fields: fields,
            form: this.validateFormOnSubmit
                ? {
                    onSubmit: function (e) {
                        e.preventDefault();
                        dispatch(form.actions.validate(meta));
                    }
                }
                : {}
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