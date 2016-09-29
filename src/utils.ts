export function isString(value: any): value is string {
  return value != null && typeof value === 'string';
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export function isThenable<T>(value: any): value is Promise<T>{
  return isObject(value) && isFunction(value.then);
}

export function isObject(value: any): value is Object {
  return typeof value === 'object';
}

export function get<T>(obj: any, path: string|Array<string|number>): T {
  if (isString(path)) {
    path = path.replace(/\[|\]/, '.').split('.');
  }
  
  return path.reduce<T>((result, key) => {
    if (isObject(result) && key) {
      return result[key.toString()];
    }

    return undefined;
  }, obj);
}