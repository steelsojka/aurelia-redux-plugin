System.register(['aurelia-framework', './utils', "./dispatch"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var aurelia_framework_1, utils_1, dispatch_1;
    var Store;
    return {
        setters:[
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (dispatch_1_1) {
                dispatch_1 = dispatch_1_1;
            }],
        execute: function() {
            Store = (function () {
                function Store(bindingEngine) {
                    this.bindingEngine = bindingEngine;
                    this._changeId = 0;
                    Store.instance = this;
                }
                Object.defineProperty(Store.prototype, "changeId", {
                    get: function () {
                        return this._changeId;
                    },
                    enumerable: true,
                    configurable: true
                });
                Store.prototype.provideStore = function (store) {
                    this.store = store;
                    while (Store._queue.length) {
                        var observerHandler = Store._queue.shift();
                        if (observerHandler) {
                            observerHandler();
                        }
                    }
                };
                Store.prototype.dispatch = function (action) {
                    this._changeId++;
                    if (utils_1.isPromise(action))
                        return action.then(dispatch_1.dispatch);
                    if (utils_1.isFunction(action))
                        return action(this.dispatch.bind(this));
                    return this.store.dispatch(action);
                };
                Store.prototype.getState = function () {
                    return this.store.getState();
                };
                Store.prototype.subscribe = function (listener) {
                    return this.store.subscribe(listener);
                };
                Store.prototype.replaceReducer = function (nextReducer) {
                    this.store.replaceReducer(nextReducer);
                };
                Store.prototype.observe = function (target, property, handler) {
                    return this.bindingEngine.propertyObserver(target, property).subscribe(handler);
                };
                Store.prototype.select = function (selector) {
                    if (utils_1.isString(selector) || Array.isArray(selector)) {
                        return utils_1.get(Store.instance.getState(), selector);
                    }
                    return selector(this.getState());
                };
                Store.queue = function (fn) {
                    if (this.instance) {
                        fn();
                    }
                    else {
                        this._queue.push(fn);
                    }
                };
                Store._queue = [];
                Store = __decorate([
                    aurelia_framework_1.inject(aurelia_framework_1.BindingEngine), 
                    __metadata('design:paramtypes', [aurelia_framework_1.BindingEngine])
                ], Store);
                return Store;
            }());
            exports_1("Store", Store);
        }
    }
});
//# sourceMappingURL=Store.js.map