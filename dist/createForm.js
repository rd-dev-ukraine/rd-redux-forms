"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RdReduxForm_1 = require("./runtime/RdReduxForm");
var existingForms = new Set();
function createForm(title, config) {
    if (!config) {
        throw new Error("Form configuration is missing.");
    }
    if (!config.fields || !Object.keys(config.fields).length) {
        throw new Error("Form fields is missing.");
    }
    title = uniqueFormTitle(title);
    return new RdReduxForm_1.RdReduxFormImpl(title, config);
}
exports.createForm = createForm;
function uniqueFormTitle(title) {
    title = title || "rd-redux-form";
    if (!existingForms.has(title)) {
        return title;
    }
    var index = 1;
    while (true) {
        var uniqueTitle = title + " " + index;
        if (existingForms.has(uniqueTitle)) {
            index++;
        }
        else {
            return uniqueTitle;
        }
    }
}
//# sourceMappingURL=createForm.js.map