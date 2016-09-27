import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import { Store, ActionCreator } from './Store';

/**
 * Turns a property into an action dispatcher. All arguments passed to the function will get passed
 * to the object creator.
 * 
 * @export
 * @param {(string|ActionCreator)} actionCreator The action type or an action creator function.
 * @returns {PropertyDecorator}
 */
export function dispatch(actionCreator: string|ActionCreator): MethodDecorator {
  return function(target: any, propertyKey: string, descriptor: any): void {
    const value = descriptor.value;
    
    if (delete target[propertyKey]) {
      Object.defineProperty(target, propertyKey, {
        enumerable: false,
        configurable: true,
        value: isFunction(value) ? (...args) => value.call(target, _dispatch, ...args) : _dispatch
      });
    }
    
    function _dispatch(...args: any[]): void {
      if (isString(actionCreator)) {
        Store.instance.dispatch({ type: actionCreator });
      } else {
        Store.instance.dispatch((actionCreator as ActionCreator)(...args));
      }
    }
  }
}