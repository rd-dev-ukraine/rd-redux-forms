"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_config_builder_1 = require("./event-config-builder");
var FormBindingConfiguration = (function () {
    function FormBindingConfiguration() {
        this.defaultFieldBinding = new event_config_builder_1.EventConfigBuilder();
    }
    FormBindingConfiguration.prototype.submit = function () {
        this.lastAction = "submit";
        this.defaultFieldBinding.add(this.lastAction, "submit", function (e) { return undefined; }, true);
        return this;
    };
    FormBindingConfiguration.prototype.format = function () {
        this.lastAction = "format";
        return this.onBlur(true);
    };
    FormBindingConfiguration.prototype.unformat = function () {
        this.lastAction = "unformat";
        return this.onFocus(true);
    };
    FormBindingConfiguration.prototype.edit = function () {
        this.lastAction = "edit";
        return this.onChange(true);
    };
    FormBindingConfiguration.prototype.onChange = function (isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        return this.onEvent("onChange", function (e) { return e.currentTarget.value; }, isDefault);
    };
    FormBindingConfiguration.prototype.onFocus = function (isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        return this.onEvent("onFocus", function (e) { return e.currentTarget.value; }, isDefault);
    };
    FormBindingConfiguration.prototype.onBlur = function (isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        return this.onEvent("onBlur", function (e) { return e.currentTarget.value; }, isDefault);
    };
    FormBindingConfiguration.prototype.onEvent = function (event, argParser, isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        this.lastEvent = event;
        this.defaultFieldBinding.add(this.lastAction, this.lastEvent, argParser, isDefault);
        return this;
    };
    FormBindingConfiguration.prototype.throttle = function (timeout) {
        return this;
    };
    return FormBindingConfiguration;
}());
exports.FormBindingConfiguration = FormBindingConfiguration;
//# sourceMappingURL=form-binding-configuration.js.map