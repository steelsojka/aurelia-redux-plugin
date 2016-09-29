import { inject, BindingEngine, Disposable } from 'aurelia-framework';

import {isString, isObject, get, isPromise, isFunction} from './utils';
import {dispatch} from "./dispatch";

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
  }

  get changeId(): number {
    return this._changeId;
  }

  provideStore(store: Redux.Store<S>): void {
    this.store = store;
    
    while (Store._queue.length) {
      const observerHandler = Store._queue.shift();

      if (observerHandler) {
        observerHandler();
      }
    }
  }

  dispatch<T extends Redux.Action>(action: T): T {
    this._changeId++;
    if(isPromise(action))
      return (<any>action).then(dispatch);
    if(isFunction(action))
      return <any>action(this.dispatch.bind(this));
    return this.store.dispatch(<any>action);
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
