"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var aurelia_framework_1 = require('aurelia-framework');
var ReduxObservationAdapter_1 = require('./ReduxObservationAdapter');
var Store_1 = require('./Store');
function configure(config, pluginConfig) {
    var container = config.container;
    var store = container.get(Store_1.Store);
    if (pluginConfig.store) {
        store.provideStore(pluginConfig.store);
    }
    container.get(aurelia_framework_1.ObserverLocator).addAdapter(container.get(ReduxObservationAdapter_1.ReduxObservationAdapter));
}
exports.configure = configure;
__export(require('./Store'));
__export(require('./select'));
__export(require('./dispatch'));
__export(require('./ReduxObservationAdapter'));
__export(require('./ReduxPropertyObserver'));
//# sourceMappingURL=aurelia-redux-plugin.js.map