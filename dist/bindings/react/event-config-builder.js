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
var EventConfigBuilder = (function () {
    function EventConfigBuilder() {
        this.events = [];
    }
    EventConfigBuilder.prototype.add = function (action, event, argsParser, isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var existing = this.events
            .find(function (e) { return e.action === action && e.event === event; });
        if (isDefault) {
            if (!existing) {
                this.events = this.events.filter(function (e) { return e !== existing; })
                    .concat([{
                        action: action,
                        argsParser: argsParser,
                        event: event,
                        isDefault: true
                    }]);
            }
            // Otherwise do nothing, default event should not override existing default event
        }
        else {
            if (!existing || existing.isDefault) {
                this.events = this.events.filter(function (e) { return e !== existing; })
                    .concat([{
                        action: action,
                        argsParser: argsParser,
                        event: event,
                        isDefault: false
                    }]);
            }
        }
    };
    EventConfigBuilder.prototype.preDispatch = function (action, event, proxy) {
        this.events = this.events.map(function (e) {
            if (e.action === action && e.event === event) {
                return __assign({}, e, { dispatchProxy: combineDispatchProxy(proxy, e.dispatchProxy), isDefault: false });
            }
            else {
                return e;
            }
        });
    };
    return EventConfigBuilder;
}());
exports.EventConfigBuilder = EventConfigBuilder;
function combineDispatchProxy(newProxy, existingProxy) {
    return function (value) {
        if (existingProxy) {
            return existingProxy(value)
                .then(function (result) { return newProxy(result); });
        }
        else {
            return newProxy(value);
        }
    };
}
//# sourceMappingURL=event-config-builder.js.map