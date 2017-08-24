"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultFormBinding = function () {
    return function (config, actions) {
        return function (dispatch, meta) { return ({
            $events: {
                form: {
                    onSubmit: function (e) {
                        e.preventDefault();
                        dispatch(actions.validate(meta));
                    }
                },
                fields: Object.keys(config.fields).reduce(function (result, fieldName) {
                    result[fieldName] = {
                        onChange: function (e, value) {
                            dispatch(actions.fieldEdit(fieldName, e !== null ? e.currentTarget.value : value, meta));
                        },
                        onBlur: function () {
                            dispatch(actions.fieldFormat(fieldName, meta));
                        }
                    };
                    return result;
                }, {})
            }
        }); };
    };
};
//# sourceMappingURL=defaultFormBinding.js.map