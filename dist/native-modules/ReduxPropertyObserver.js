var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { TaskQueue } from 'aurelia-framework';
import { subscriberCollection } from 'aurelia-binding';
import { Store } from './Store';
export var ReduxPropertyObserver = (function () {
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
        subscriberCollection(), 
        __metadata('design:paramtypes', [Object, String, Store, TaskQueue])
    ], ReduxPropertyObserver);
    return ReduxPropertyObserver;
}());
//# sourceMappingURL=ReduxPropertyObserver.js.map