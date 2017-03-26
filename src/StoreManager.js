var has = require("@nathanfaucett/has"),
    isFunction = require("@nathanfaucett/is_function"),
    EventEmitter = require("@nathanfaucett/event_emitter");


var StoreManagerPrototype;


module.exports = StoreManager;


function StoreManager(application) {

    EventEmitter.call(this, -1);

    this._stores = {};
    this.application = application;
}
EventEmitter.extend(StoreManager);
StoreManagerPrototype = StoreManager.prototype;

StoreManagerPrototype.register = function(store) {
    var application = this.application,
        stores = this._stores,
        storeName = store.storeName;

    if (has(stores, storeName)) {
        throw new Error("StoreManager register(store) store named " + storeName + " already exists");
    } else {
        stores[storeName] = store;
    }

    store.application = application;
    if (!isFunction(store.dispatchHandler)) {
        throw new Error(
            "StoreManager register(store) store named " + storeName +
            " dispatchHandler is not defined make sure you called Store.call(this) in constructor " +
            " or define it on the store, dispatchHandler(action: Object)"
        );
    }
    application.dispatcher.register(store.dispatchHandler);

    return this;
};

StoreManagerPrototype.unregister = function(store) {
    var application = this.application,
        stores = this._stores,
        storeName = store.storeName;

    if (has(stores, storeName)) {
        delete stores[storeName];
    } else {
        throw new Error("StoreManager unregister(store) store named " + storeName + " does not exists");
    }

    store.application = null;
    application.dispatcher.unregister(store.dispatchHandler);

    return this;
};

StoreManagerPrototype.toJSON = function() {
    var localHas = has,
        stores = this._stores,
        json = {},
        key;

    for (key in stores) {
        if (localHas(stores, key)) {
            json[key] = stores[key].toJSON();
        }
    }

    return json;
};

StoreManagerPrototype.fromJSON = function(json) {
    var localHas = has,
        stores = this._stores,
        key;

    for (key in json) {
        if (localHas(json, key) && localHas(stores, key)) {
            stores[key].fromJSON(json[key]);
        }
    }

    return this;
};