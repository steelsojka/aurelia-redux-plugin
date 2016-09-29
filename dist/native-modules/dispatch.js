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
export function dispatch(actionCreator, options) {
    if (options === void 0) { options = {}; }
    return function (target, propertyKey) {
        if (delete target[propertyKey]) {
            Object.defineProperty(target, propertyKey, {
                enumerable: false,
                configurable: true,
                value: _dispatcher
            });
        }
        function _dispatcher() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (isString(options.creator) && isFunction(target[options.creator])) {
                return (_a = target[options.creator]).call.apply(_a, [target, _dispatch].concat(args));
            }
            else if (isFunction(options.creator)) {
                return options.creator.apply(options, [_dispatch].concat(args));
            }
            return _dispatch.apply(void 0, args);
            var _a;
        }
        function _dispatch() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (!Store.instance) {
                return null;
            }
            if (isString(actionCreator)) {
                var action = { type: actionCreator };
                if (isObject(args[0])) {
                    action = Object.assign(action, args[0]);
                }
                return Store.instance.dispatch(action);
            }
            return Store.instance.dispatch(actionCreator.apply(void 0, args));
        }
    };
}
//# sourceMappingURL=dispatch.js.map