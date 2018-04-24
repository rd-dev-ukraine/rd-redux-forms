"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Configures an actions dispatched in response to events for a single untyped field.
 */
var FieldBindingConfiguration = (function () {
    function FieldBindingConfiguration() {
        this.bindings = {};
    }
    FieldBindingConfiguration.prototype.submit = function () {
        return this.setAction("submit");
    };
    FieldBindingConfiguration.prototype.format = function () {
        return this.setAction("format");
    };
    FieldBindingConfiguration.prototype.unformat = function () {
        return this.setAction("unformat");
    };
    FieldBindingConfiguration.prototype.edit = function () {
        return this.setAction("edit");
    };
    FieldBindingConfiguration.prototype.onChange = function () {
        return this.onEvent("onChange", getValueFromEvent);
    };
    FieldBindingConfiguration.prototype.onFocus = function () {
        return this.onEvent("onFocus", getValueFromEvent);
    };
    FieldBindingConfiguration.prototype.onBlur = function () {
        return this.onEvent("onBlur", getValueFromEvent);
    };
    FieldBindingConfiguration.prototype.onEvent = function (event, argsToValue) {
        var config = this.eventConfig(event);
        config.argToValue = argsToValue;
        return this;
    };
    FieldBindingConfiguration.prototype.throttle = function (timeout) {
        var config = this.eventConfig(this.lastEvent);
        config.run = (function () {
            var timeoutId;
            return function (v) {
                return new Promise(function (resolve) {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    timeoutId = setTimeout(function () { return resolve(v); }, timeout);
                });
            };
        })();
        return this;
    };
    /**
     * Creates an object contains a set of event handlers
     * for react input element which dispatches rd-redux-forms actions.
     *
     * @param form Form to build a binding for it.
     * @param field Name of the field for building binding.
     * @param dispatch Redux dispatch function.
     * @param meta Additional action parameter.
     *
     * @returns An object contains a map of event handlers for react inputs.
     */
    FieldBindingConfiguration.prototype.build = function (form, field, dispatch, meta) {
        var _this = this;
        if (!form) {
            throw new Error("Form is not defined.");
        }
        if (!field) {
            throw new Error("Field is not defined.");
        }
        var eventsMap = {};
        Object.keys(this.bindings)
            .forEach(function (action) {
            var events = _this.getEventsOrDefault(action);
            Object.keys(events)
                .forEach(function (event) {
                if (!eventsMap[event]) {
                    eventsMap[event] = {};
                }
                eventsMap[event][action] = events[event];
            });
        });
        return Object.keys(eventsMap)
            .reduce(function (fieldBindings, event) {
            var actions = eventsMap[event];
            fieldBindings[event] = function (e) {
                Object.keys(actions)
                    .forEach(function (action) {
                    var config = actions[action];
                    var value = config.argToValue(e);
                    var run = config.run || (function (val) { return Promise.resolve(val); });
                    run(value)
                        .then(function (val) {
                        switch (action) {
                            case "format": {
                                dispatch(form.actions.fieldFormat(field, meta));
                                break;
                            }
                            case "unformat": {
                                dispatch(form.actions.fieldUnformat(field, meta));
                                break;
                            }
                            case "edit": {
                                dispatch(form.actions.fieldEdit(field, value, meta));
                                break;
                            }
                            case "submit": {
                                dispatch(form.actions.validate(meta));
                                break;
                            }
                        }
                    });
                });
            };
            return fieldBindings;
        }, {});
    };
    FieldBindingConfiguration.prototype.setAction = function (action) {
        this.lastAction = action;
        if (!this.bindings[action]) {
            this.bindings[action] = {};
        }
        return this;
    };
    FieldBindingConfiguration.prototype.eventConfig = function (event) {
        this.lastEvent = event;
        if (!this.bindings[this.lastAction]) {
            this.bindings[this.lastAction] = {};
        }
        var events = this.bindings[this.lastAction];
        if (!events[this.lastEvent]) {
            events[this.lastEvent] = {};
        }
        return events[this.lastEvent];
    };
    FieldBindingConfiguration.prototype.getEventsOrDefault = function (action) {
        var events = this.bindings[action];
        if (!events) {
            throw new Error("Action " + action + " wasn't configured");
        }
        if (Object.keys(events).length === 0) {
            switch (action) {
                case "format":
                    return this.format().onBlur().getEventsOrDefault(action);
                case "unformat":
                    return this.unformat().onFocus().getEventsOrDefault(action);
                case "edit":
                    return this.edit().onChange().getEventsOrDefault(action);
                case "submit":
                    return this.submit().onChange().throttle(1000).getEventsOrDefault(action);
                default:
                    return {};
            }
        }
        return events;
    };
    return FieldBindingConfiguration;
}());
exports.FieldBindingConfiguration = FieldBindingConfiguration;
function getValueFromEvent(e) {
    if (e && "currentTarget" in e.currentTarget && "value" in e.currentTarget) {
        return e.currentTarget.value;
    }
    return e;
}
//# sourceMappingURL=field-binding-configuration.js.map