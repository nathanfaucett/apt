var EventEmitter = require("@nathanfaucett/event_emitter"),
    Dispatcher = require("./Dispatcher"),
    StoreManager = require("./StoreManager");


var ApplicationPrototype;


module.exports = Application;


function Application() {

    EventEmitter.call(this, -1);

    this.dispatcher = new Dispatcher();
    this.storeManager = new StoreManager(this);
}
EventEmitter.extend(Application);
ApplicationPrototype = Application.prototype;

ApplicationPrototype.registerStore = function(store) {
    this.storeManager.register(store);
};

ApplicationPrototype.unregisterStore = function(store) {
    this.storeManager.unregister(store);
};

ApplicationPrototype.dispatchAction = function(action) {
    this.dispatcher.dispatch(action);
};

ApplicationPrototype.toJSON = function(json) {
    json = json || {};
    json.storeManager = this.storeManager.toJSON();
    return json;
};

ApplicationPrototype.fromJSON = function(json) {
    json = json || {};
    this.storeManager.fromJSON(json.storeManager);
    return this;
};