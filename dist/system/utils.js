System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isString(value) {
        return value != null && typeof value === 'string';
    }
    exports_1("isString", isString);
    function isFunction(value) {
        return typeof value === 'function';
    }
    exports_1("isFunction", isFunction);
    function isPromise(value) {
        return value && isFunction(value.then);
    }
    exports_1("isPromise", isPromise);
    function isObject(value) {
        return typeof value === 'object';
    }
    exports_1("isObject", isObject);
    function get(obj, path) {
        if (isString(path)) {
            path = path.replace(/\[|\]/, '.').split('.');
        }
        return path.reduce(function (result, key) {
            if (isObject(result) && key) {
                return result[key.toString()];
            }
            return undefined;
        }, obj);
    }
    exports_1("get", get);
    return {
        setters:[],
        execute: function() {
        }
    }
});
//# sourceMappingURL=utils.js.map