"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var field_binding_configuration_1 = require("./field-binding-configuration");
var form_binding_configuration_1 = require("./form-binding-configuration");
function reactBinding() {
    return new form_binding_configuration_1.FormBindingConfiguration();
}
exports.reactBinding = reactBinding;
function field() {
    return new field_binding_configuration_1.FieldBindingConfiguration();
}
exports.field = field;
//# sourceMappingURL=index.js.map