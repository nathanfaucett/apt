var EventEmitter = require("@nathanfaucett/event_emitter");


var DISPATCH = "dispatch",
    DispatcherPrototype;


module.exports = Dispatcher;


function Dispatcher() {
    EventEmitter.call(this, -1);
}
EventEmitter.extend(Dispatcher);
DispatcherPrototype = Dispatcher.prototype;

DispatcherPrototype.register = function(callback) {
    return this.on(DISPATCH, callback);
};

DispatcherPrototype.unregister = function(callback) {
    return this.off(DISPATCH, callback);
};

DispatcherPrototype.dispatch = function(action) {
    return this.emitArg(DISPATCH, action);
};
