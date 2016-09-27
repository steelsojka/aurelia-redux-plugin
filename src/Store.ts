import { inject, BindingEngine, Disposable } from 'aurelia-framework';
import get from 'lodash/get';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';

export type PropertyDecorator = (target: any, propertyKey: string) => void;
export type ActionCreator = <T extends Redux.Action>(...args: any[]) => T;
export type StoreSelector<S, T> = (state: S) => T;

@inject(BindingEngine)
export class Store<S> {
  static instance: Store<any>;
  static _queue: Function[] = [];

  private store: Redux.Store<S>;
  private _changeId: number = 0;
  
  constructor(private bindingEngine: BindingEngine) {
    Store.instance = this;

    while (Store._queue.length) {
      const observerHandler = Store._queue.shift();

      if (observerHandler) {
        observerHandler();
      }
    }
  }

  get changeId(): number {
    return this._changeId;
  }

  provideStore(store: Redux.Store<S>): void {
    this.store = store;
  }

  dispatch<T extends Redux.Action>(action: T): T {
    this._changeId++;
    
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

  static queue(fn: Function): void {
    if (this.instance) {
      fn();  
    } else {
      this._queue.push(fn);
    }
  }
}
