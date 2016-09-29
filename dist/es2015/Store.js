var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { inject, BindingEngine } from 'aurelia-framework';
import { isString, get, isPromise, isFunction } from './utils';
import { dispatch } from "./dispatch";
let Store_1 = class Store {
    constructor(bindingEngine) {
        this.bindingEngine = bindingEngine;
        this._changeId = 0;
        Store_1.instance = this;
    }
    get changeId() {
        return this._changeId;
    }
    provideStore(store) {
        this.store = store;
        while (Store_1._queue.length) {
            const observerHandler = Store_1._queue.shift();
            if (observerHandler) {
                observerHandler();
            }
        }
    }
    dispatch(action) {
        this._changeId++;
        if (isPromise(action))
            return action.then(dispatch);
        if (isFunction(action))
            return action(this.dispatch.bind(this));
        return this.store.dispatch(action);
    }
    getState() {
        return this.store.getState();
    }
    subscribe(listener) {
        return this.store.subscribe(listener);
    }
    replaceReducer(nextReducer) {
        this.store.replaceReducer(nextReducer);
    }
    observe(target, property, handler) {
        return this.bindingEngine.propertyObserver(target, property).subscribe(handler);
    }
    select(selector) {
        if (isString(selector) || Array.isArray(selector)) {
            return get(Store_1.instance.getState(), selector);
        }
        return selector(this.getState());
    }
    static queue(fn) {
        if (this.instance) {
            fn();
        }
        else {
            this._queue.push(fn);
        }
    }
};
export let Store = Store_1;
Store._queue = [];
Store = Store_1 = __decorate([
    inject(BindingEngine), 
    __metadata('design:paramtypes', [BindingEngine])
], Store);
//# sourceMappingURL=Store.js.map