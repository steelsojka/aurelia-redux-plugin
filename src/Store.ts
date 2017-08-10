import { inject, BindingEngine, Disposable } from 'aurelia-framework';

import { isString, isObject, get, isThenable, isFunction } from './utils';

export type ActionCreator<T extends Redux.Action, S> = (...args: any[]) => Dispatchable<T, S>;
export type StoreSelector<S, T> = (state: S) => T;
export type Thunk<T extends Redux.Action, S> = (dispatch: (action: Dispatchable<T, S>) => T, getState: () => S) => T;
export type Dispatchable<T extends Redux.Action, S> = T|Promise<T>|Thunk<T, S>;

export interface ReduxPluginConfig<S> {
  store?: Redux.Store<S>;
  async?: boolean;
}

@inject(BindingEngine)
export class Store<S> {
  static instance: Store<any>;
  static _queue: Function[] = [];

  private store: Redux.Store<S>;
  private _changeId: number = 0;
  private _devToolsConnected: boolean = false;
  
  constructor(
    private bindingEngine: BindingEngine,
    private config: ReduxPluginConfig<S>
  ) {
    Store.instance = this;

    this.config = Object.assign({ async: false }, this.config);

    if (this.config.store) {
      this.provideStore(this.config.store);
    }

    if (window.__REDUX_DEVTOOLS_EXTENSION__) {
      window.__REDUX_DEVTOOLS_EXTENSION__.listen(({type}: any) => {
        if (type === 'START') {
          this._devToolsConnected = true;
        } else if (type === 'STOP') {
          this._devToolsConnected = false;
        }
      });
    }
  }

  get changeId(): number {
    return this._changeId;
  }

  get devToolsConnected(): boolean {
    return this._devToolsConnected;
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

  dispatch<T extends Redux.Action>(action: Dispatchable<T, S>): T|Promise<T> {
    this._changeId++;
    
    if (this.config.async) {
      if (isThenable<T>(action)) {
        return action.then(this.dispatch.bind(this));
      }
      
      if (isFunction(action)) {
        return (<Thunk<T, S>>action)(this.dispatch.bind(this), this.store.getState.bind(this.store));
      }
    }
    
    return this.store.dispatch(<T>action);
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

  select<T>(selector: string|string[]|StoreSelector<S, T>, instance?: any, options: { invoke?: boolean } = {}): T {
    if (isString(selector)) {
      if (options.invoke) {
        const instanceSelector = get<Function|undefined>(instance, selector);

        if (isFunction(instanceSelector)) {
          return instanceSelector.call(instance, this.getState());
        }
      }
      
      return get<T>(this.getState(), <string>selector);
    } else if (Array.isArray(selector)) {
      return get<T>(this.getState(), <string[]>selector);
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
