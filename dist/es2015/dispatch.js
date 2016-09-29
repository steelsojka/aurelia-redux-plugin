import { isObject, isFunction, isString } from './utils';
import { Store } from './Store';
/**
 * Turns a property into an action dispatcher. All arguments passed to the function will get passed
 * to the object creator.
 *
 * @export
 * @param {(string|ActionCreator)} actionCreator The action type or an action creator function.
 * @param {DispatchOptions} [options={}] Optional options for dispatch behavior.
 * @returns {PropertyDecorator}
 * @example
 *
 * class Person {
 *   @dispatch('SET_FIRST_NAME')
 *   setFirstName: (payload: { name: string }) => Redux.Action
 * }
 *
 * const person = new Person();
 *
 * person.setFirstName({ name: 'Steven' }); // Dispatches { type: 'SET_FIRST_NAME', name: 'Steven' }
 *
 * // An action can be used instead
 *
 * const setFirstName = payload => ({ type: 'SET_FIRST_NAME', payload });
 *
 * class Person {
 *   @dispatch(setFirstName)
 *   setFirstName: (name: string) => Redux.Action
 * }
 *
 * const person = new Person();
 *
 * person.setFirstName('Steven'); // Dispatches { type: 'SET_FIRST_NAME', payload: 'Steven' }
 *
 * // You can create an optional creator to do custom dispatches.
 *
 * class Person {
 *   @dispatch(setFirstName, { creator: 'firstNameCreator' })
 *   setFirstName: (name: string) => Redux.Action;
 *
 *   private firstNameCreator(dispatch: Function, name: string): Redux.Action {
 *     // Do something before dispatching the event
 *
 *     // The dispatch method is bound to the action creator. It only requires the payload argument.
 *     dispatch(name.toUpperCase()); // Dispatches { type: 'SET_FIRST_NAME', payload: 'Steven' }
 *   }
 * }
 */
export function dispatch(actionCreator, options = {}) {
    return function (target, propertyKey) {
        if (delete target[propertyKey]) {
            Object.defineProperty(target, propertyKey, {
                enumerable: false,
                configurable: true,
                value: _dispatcher
            });
        }
        function _dispatcher(...args) {
            if (isString(options.creator) && isFunction(target[options.creator])) {
                return target[options.creator].call(target, _dispatch, ...args);
            }
            else if (isFunction(options.creator)) {
                return options.creator(_dispatch, ...args);
            }
            return _dispatch(...args);
        }
        function _dispatch(...args) {
            if (!Store.instance) {
                return null;
            }
            if (isString(actionCreator)) {
                let action = { type: actionCreator };
                if (isObject(args[0])) {
                    action = Object.assign(action, args[0]);
                }
                return Store.instance.dispatch(action);
            }
            return Store.instance.dispatch(actionCreator(...args));
        }
    };
}
//# sourceMappingURL=dispatch.js.map