"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormActionsImpl_1 = require("./FormActionsImpl");
exports.formActionHelper = {
    deriveAction: function (action) {
        return new FormActionsImpl_1.FormActionsImpl(action.form);
    }
};
//# sourceMappingURL=FormActionsHelper.js.map