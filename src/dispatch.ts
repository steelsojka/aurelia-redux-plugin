import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import { Store, ActionCreator } from './Store';

export interface DispatchOptions {
  creator?: string;
}

/**
 * Turns a property into an action dispatcher. All arguments passed to the function will get passed
 * to the object creator.
 * 
 * @export
 * @param {(string|ActionCreator)} actionCreator The action type or an action creator function.
 * @returns {PropertyDecorator}
 */
export function dispatch(actionCreator: string|ActionCreator, options: DispatchOptions = {}): PropertyDecorator {
  return function(target: any, propertyKey: string): void {
    if (delete target[propertyKey]) {
      Object.defineProperty(target, propertyKey, {
        enumerable: false,
        configurable: true,
        value: _dispatcher
      });
    }

    function _dispatcher<T extends Redux.Action>(...args: any[]): T|Promise<T> {
      if (isString(options.creator) && isFunction(target[options.creator])) {
        return target[options.creator].call(target, _dispatch, ...args);
      } else if (isFunction(options.creator)) {
        return options.creator(_dispatch, ...args);
      }

      return _dispatch(...args) as T;
    }
    
    function _dispatch<T extends Redux.Action>(...args: any[]): T {
      if (isString(actionCreator)) {
        return Store.instance.dispatch({ type: actionCreator } as T);
      } 
      
      return Store.instance.dispatch((actionCreator as ActionCreator)(...args) as T);
    }
  }
}