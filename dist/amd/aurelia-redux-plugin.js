define(["require", "exports", 'aurelia-framework', './ReduxObservationAdapter', './Store', './Store', './select', './dispatch', './ReduxObservationAdapter', './ReduxPropertyObserver'], function (require, exports, aurelia_framework_1, ReduxObservationAdapter_1, Store_1, Store_2, select_1, dispatch_1, ReduxObservationAdapter_2, ReduxPropertyObserver_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    function configure(config, pluginConfig) {
        var container = config.container;
        var store = container.get(Store_1.Store);
        if (pluginConfig.store) {
            store.provideStore(pluginConfig.store);
        }
        container.get(aurelia_framework_1.ObserverLocator).addAdapter(container.get(ReduxObservationAdapter_1.ReduxObservationAdapter));
    }
    exports.configure = configure;
    __export(Store_2);
    __export(select_1);
    __export(dispatch_1);
    __export(ReduxObservationAdapter_2);
    __export(ReduxPropertyObserver_1);
});
//# sourceMappingURL=aurelia-redux-plugin.js.map