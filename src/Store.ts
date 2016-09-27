import { inject, BindingEngine, Disposable } from 'aurelia-framework';
import get from 'lodash/get';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';

export type PropertyDecorator = (target: any, propertyKey: string) => void;
export type ActionCreator = <T extends Redux.Action>(...args: any[]) => T;

export interface StoreSelector<S, T> {
  (state: S): T;
}

export interface ReduxSelectConfig {
  observer?: boolean|string;
}

@inject(BindingEngine)
export class Store<S> {
  static instance: Store<any>;
  static observerQueue: Function[] = [];

  private store: Redux.Store<S>;
  
  constructor(private bindingEngine: BindingEngine) {
    Store.instance = this;

    while (Store.observerQueue.length) {
      const observerHandler = Store.observerQueue.shift();

      if (observerHandler) {
        observerHandler();
      }
    }
  }

  provideStore(store: Redux.Store<S>): void {
    this.store = store;
  }

  dispatch<T extends Redux.Action>(action: T): T {
    return this.store.dispatch(action);
  }

  getState(): S {
    return this.store.getState();
  }

  subscribe(listener: () => void): Redux.Unsubscribe {
    return this.store.subscribe(listener);
  }

  replaceReducer(nextReducer: Redux.Reducer<S>): void {
    this.store.replaceReducer(nextReducer);
  }

  observe(target, property, handler): Disposable {
    return this.bindingEngine.propertyObserver(target, property).subscribe(handler);
  }

  select<T>(selector: string|string[]|StoreSelector<S, T>): T {
    if (isString(selector) || Array.isArray(selector)) {
      return get<T>(Store.instance.getState(), <string>selector);
    }
    
    return (<StoreSelector<S, T>>selector)(this.getState());
  }
}

/**
 * Decorates a property that represents derived data from the applications store.
 * 
 * @export
 * @template S The root application state.
 * @template T The return type of the selector.
 * @param {(string|Array<string|number>|StoreSelector<S, T>|null)} [selector] If a string is used it will be used
 *   as a path to access on the root state. The path can also be an array of strings representing a path. If a function 
 *   is used, it will be invoked with the root state. If not value is given then the property name will be used as the path.
 * @param {ReduxSelectConfig} [config={}] A config object to configure behavior.
 * @returns {PropertyDecorator}

 */
export function select<S, T>(selector?: string|Array<string|number>|StoreSelector<S, T>|null, config: ReduxSelectConfig = {}): PropertyDecorator {
  return function(target: any, propertyKey: string): void {
    const handlerName = isString(config.observer) ? config.observer : `${propertyKey}Changed`;
    
    let isDirty: boolean = true;
    let lastValue: T;
    
    if (!selector) {
      selector = propertyKey;
    }
    
    (getter as any).__redux__ = true;

    if (delete target[propertyKey]) {
      Object.defineProperty(target, propertyKey, {
        get: getter,
        enumerable: true,
        configurable: true
      });
    }
    
    // This needs to come after we define the getter to get the correct observer.
    const bindObserver = () => Store.instance.observe(target, propertyKey, observer);

    if (Store.instance) {
      bindObserver();
    } else {
      Store.observerQueue.push(bindObserver);
    }
    
    function getter(): T {
      let value = lastValue;
      
      if (isDirty) {
        value = Store.instance.select(selector as StoreSelector<S, T>);
        lastValue = value;
        isDirty = false;
      }

      return value;
    }

    function observer(...args: any[]): void {
      if (config.observer) {
        target[handlerName].apply(target, args);
      }

      isDirty = true;
    }
  }
}

/**
 * Turns a property into an action dispatcher. All arguments passed to the function will get passed
 * to the object creator.
 * 
 * @export
 * @param {(string|ActionCreator)} actionCreator The action type or an action creator function.
 * @returns {PropertyDecorator}
 */
export function dispatch(actionCreator: string|ActionCreator): PropertyDecorator {
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
        Store.instance.dispatch(actionCreator(...args));
      }
    }
  }
}
