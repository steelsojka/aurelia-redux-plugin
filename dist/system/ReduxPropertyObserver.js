System.register(['aurelia-framework', 'aurelia-binding', './Store'], function(exports_1, context_1) {
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
    var aurelia_framework_1, aurelia_binding_1, Store_1;
    var ReduxPropertyObserver;
    return {
        setters:[
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function (aurelia_binding_1_1) {
                aurelia_binding_1 = aurelia_binding_1_1;
            },
            function (Store_1_1) {
                Store_1 = Store_1_1;
            }],
        execute: function() {
            ReduxPropertyObserver = (function () {
                function ReduxPropertyObserver(obj, propertyName, store, taskQueue) {
                    this.obj = obj;
                    this.propertyName = propertyName;
                    this.store = store;
                    this.taskQueue = taskQueue;
                    this.isSubscribed = false;
                    this.subscribers = 0;
                    this.queued = false;
                }
                ReduxPropertyObserver.prototype.getValue = function () {
                    return this.obj[this.propertyName];
                };
                ReduxPropertyObserver.prototype.setValue = function (value) {
                    throw new Error('AureliaRedux -> Properties must be set through a dispatched action!');
                };
                ReduxPropertyObserver.prototype.subscribe = function (context, callable) {
                    this.addSubscriber(context, callable);
                    this.subscribers++;
                    if (!this.isSubscribed) {
                        this.subscription = this.store.subscribe(this.onUpdate.bind(this));
                        this.isSubscribed = true;
                    }
                };
                ReduxPropertyObserver.prototype.unsubscribe = function (context, callable) {
                    this.removeSubscriber(context, callable);
                    this.subscribers--;
                    if (this.subscribers < 1) {
                        if (this.subscription) {
                            this.subscription();
                            this.subscription = null;
                        }
                        this.isSubscribed = false;
                    }
                };
                ReduxPropertyObserver.prototype.unbind = function () {
                    if (this.subscription) {
                        this.subscription();
                        this.subscription = null;
                    }
                    this.lastValue = null;
                };
                ReduxPropertyObserver.prototype.call = function () {
                    var currentValue = this.obj[this.propertyName];
                    if (currentValue !== this.lastValue) {
                        this.callSubscribers(currentValue, this.lastValue);
                        this.lastValue = currentValue;
                    }
                    this.queued = false;
                };
                ReduxPropertyObserver.prototype.onUpdate = function () {
                    if (!this.queued) {
                        this.taskQueue.queueMicroTask(this);
                        this.queued = true;
                    }
                };
                ReduxPropertyObserver = __decorate([
                    aurelia_binding_1.subscriberCollection(), 
                    __metadata('design:paramtypes', [Object, String, Store_1.Store, aurelia_framework_1.TaskQueue])
                ], ReduxPropertyObserver);
                return ReduxPropertyObserver;
            }());
            exports_1("ReduxPropertyObserver", ReduxPropertyObserver);
        }
    }
});
//# sourceMappingURL=ReduxPropertyObserver.js.map