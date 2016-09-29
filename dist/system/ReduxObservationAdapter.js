System.register(['aurelia-framework', './ReduxPropertyObserver', './Store', './select'], function(exports_1, context_1) {
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
    var aurelia_framework_1, ReduxPropertyObserver_1, Store_1, select_1;
    var ReduxObservationAdapter;
    return {
        setters:[
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function (ReduxPropertyObserver_1_1) {
                ReduxPropertyObserver_1 = ReduxPropertyObserver_1_1;
            },
            function (Store_1_1) {
                Store_1 = Store_1_1;
            },
            function (select_1_1) {
                select_1 = select_1_1;
            }],
        execute: function() {
            ReduxObservationAdapter = (function () {
                function ReduxObservationAdapter(store, taskQueue) {
                    this.store = store;
                    this.taskQueue = taskQueue;
                }
                ReduxObservationAdapter.prototype.getObserver = function (object, propertyName, descriptor) {
                    var isReduxSelector = (descriptor && descriptor.get && descriptor.get.__redux__) || aurelia_framework_1.metadata.get(select_1.SELECTOR_METADATA_KEY, object, propertyName);
                    if (isReduxSelector) {
                        return new ReduxPropertyObserver_1.ReduxPropertyObserver(object, propertyName, this.store, this.taskQueue);
                    }
                    return null;
                };
                ReduxObservationAdapter = __decorate([
                    aurelia_framework_1.inject(Store_1.Store, aurelia_framework_1.TaskQueue), 
                    __metadata('design:paramtypes', [Store_1.Store, aurelia_framework_1.TaskQueue])
                ], ReduxObservationAdapter);
                return ReduxObservationAdapter;
            }());
            exports_1("ReduxObservationAdapter", ReduxObservationAdapter);
        }
    }
});
//# sourceMappingURL=ReduxObservationAdapter.js.map