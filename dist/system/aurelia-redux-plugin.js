System.register(['aurelia-framework', './ReduxObservationAdapter', './Store', './select', './dispatch', './ReduxPropertyObserver'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var aurelia_framework_1, ReduxObservationAdapter_1, Store_1;
    function configure(config, pluginConfig) {
        var container = config.container;
        var store = container.get(Store_1.Store);
        if (pluginConfig.store) {
            store.provideStore(pluginConfig.store);
        }
        container.get(aurelia_framework_1.ObserverLocator).addAdapter(container.get(ReduxObservationAdapter_1.ReduxObservationAdapter));
    }
    exports_1("configure", configure);
    var exportedNames_1 = {
        'configure': true
    };
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default"&& !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters:[
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function (ReduxObservationAdapter_1_1) {
                ReduxObservationAdapter_1 = ReduxObservationAdapter_1_1;
                exportStar_1(ReduxObservationAdapter_1_1);
            },
            function (Store_1_1) {
                Store_1 = Store_1_1;
                exportStar_1(Store_1_1);
            },
            function (select_1_1) {
                exportStar_1(select_1_1);
            },
            function (dispatch_1_1) {
                exportStar_1(dispatch_1_1);
            },
            function (ReduxPropertyObserver_1_1) {
                exportStar_1(ReduxPropertyObserver_1_1);
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=aurelia-redux-plugin.js.map