var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { inject, TaskQueue, metadata } from 'aurelia-framework';
import { ReduxPropertyObserver } from './ReduxPropertyObserver';
import { Store } from './Store';
import { SELECTOR_METADATA_KEY } from './select';
export let ReduxObservationAdapter = class ReduxObservationAdapter {
    constructor(store, taskQueue) {
        this.store = store;
        this.taskQueue = taskQueue;
    }
    getObserver(object, propertyName, descriptor) {
        const isReduxSelector = (descriptor && descriptor.get && descriptor.get.__redux__) || metadata.get(SELECTOR_METADATA_KEY, object, propertyName);
        if (isReduxSelector) {
            return new ReduxPropertyObserver(object, propertyName, this.store, this.taskQueue);
        }
        return null;
    }
};
ReduxObservationAdapter = __decorate([
    inject(Store, TaskQueue), 
    __metadata('design:paramtypes', [Store, TaskQueue])
], ReduxObservationAdapter);
//# sourceMappingURL=ReduxObservationAdapter.js.map