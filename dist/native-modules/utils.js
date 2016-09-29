export function isString(value) {
    return value != null && typeof value === 'string';
}
export function isFunction(value) {
    return typeof value === 'function';
}
export function isPromise(value) {
    return value && isFunction(value.then);
}
export function isObject(value) {
    return typeof value === 'object';
}
export function get(obj, path) {
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
//# sourceMappingURL=utils.js.map