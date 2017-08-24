"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeoutSavingFormBinding = function () {
    return function (config, actions) {
        return function (dispatch, meta) {
            var timer;
            return ({
                $events: {
                    form: {
                        onChangeImmediately: function (fieldName, value) {
                            dispatch(actions.fieldEdit(fieldName, value, meta));
                            dispatch(actions.fieldFormat(fieldName, meta));
                            dispatch(actions.validate(meta));
                        },
                    },
                    fields: Object.keys(config.fields).reduce(function (result, fieldName) {
                        result[fieldName] = {
                            onChange: function (e, value) {
                                if (timer) {
                                    clearTimeout(timer);
                                }
                                dispatch(actions.fieldEdit(fieldName, e !== null ? e.currentTarget.value : value));
                                timer = setTimeout(function () {
                                    dispatch(actions.fieldFormat(fieldName, meta));
                                    dispatch(actions.validate(meta));
                                }, 3000);
                            }
                        };
                        return result;
                    }, {}),
                }
            });
        };
    };
};
//# sourceMappingURL=timeoutSavingFormBinding.js.map