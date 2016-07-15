var inherits = require("@nathanfaucett/inherits"),
    isString = require("@nathanfaucett/is_string"),
    isArray = require("@nathanfaucett/is_array"),
    arrayForEach = require("@nathanfaucett/array-for_each"),
    EventEmitter = require("@nathanfaucett/event_emitter");


var EVENT_CHANGE = "change",
    StorePrototype;


module.exports = Store;


function Store() {
    var _this = this;

    EventEmitter.call(this, -1);

    this.application = null;

    this.dispatchHandler = function dispatchHandler(action) {
        _this.handler(action);
    };
}
EventEmitter.extend(Store);

Store.extend = function(Child, storeName, constsNames) {
    var ChildPrototype, consts;

    if (!isString(storeName)) {
        throw new Error("Store.extend(Child, storeName, constsNames) storeName must be a String");
    }
    if (!isArray(constsNames)) {
        throw new Error("Store.extend(Child, storeName, constsNames) constsNames must be an Array");
    }

    inherits(Child, this);
    ChildPrototype = Child.prototype;

    Child.storeName = ChildPrototype.storeName = storeName;

    consts = ChildPrototype.consts = {};

    arrayForEach(constsNames, function each(name) {
        consts[name] = storeName + "." + name;
    });


    return Child;
};

StorePrototype = Store.prototype;

Store.storeName = StorePrototype.storeName = "Store";
StorePrototype.consts = {};

StorePrototype.emitChange = function() {
    return this.emit(EVENT_CHANGE);
};

StorePrototype.addChangeListener = function(callback) {
    return this.on(EVENT_CHANGE, callback);
};

StorePrototype.removeChangeListener = function(callback) {
    return this.off(EVENT_CHANGE, callback);
};

StorePrototype.handler = function( /* action */ ) {
    throw new Error("handler(action) not defined for Store " + this.storeName);
};

StorePrototype.toJSON = function() {
    throw new Error("toJSON(action) not defined for Store " + this.storeName);
};

StorePrototype.fromJSON = function( /* json */ ) {
    throw new Error("fromJSON(action) not defined for Store " + this.storeName);
};
