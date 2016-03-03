var values = require("values"),
    apt = require("..");


var Store = apt.Store,
    TodoStorePrototype,

    _todos = {},
    _ID = 1;


module.exports = TodoStore;


function TodoStore() {
    Store.call(this);
}
Store.extend(TodoStore, "test.TodoStore", [
    "CREATE",
    "UPDATE",
    "DELETE"
]);

TodoStorePrototype = TodoStore.prototype;

TodoStorePrototype.all = function(callback) {
    callback(undefined, values(_todos));
};

TodoStorePrototype.show = function(id, callback) {
    var todo = _todos[id];

    if (todo) {
        callback(undefined, todo);
    } else {
        callback(new Error("TodoStore.show(id) no todo found with id " + id));
    }
};

TodoStorePrototype.toJSON = function() {
    return JSON.parse(JSON.stringify(_todos));
};
TodoStorePrototype.fromJSON = function(json) {
    _todos = json;
    return this;
};

function TodoStore_create(_this, text) {
    var id = _ID++;

    _todos[id] = {
        id: id,
        text: text
    };
}

function TodoStore_update(_this, id, text) {
    var todo = _todos[id];

    if (todo) {
        todo.text = text;
    }
}

function TodoStore_delete(_this, id) {
    delete _todos[id];
}

TodoStorePrototype.handler = function(action) {
    var consts = this.consts;

    switch (action.type) {
        case consts.CREATE:
            TodoStore_create(this, action.text);
            this.emitChange();
            break;
        case consts.UPDATE:
            TodoStore_update(this, action.id, action.text);
            this.emitChange();
            break;
        case consts.DELETE:
            TodoStore_delete(this, action.id);
            this.emitChange();
            break;
    }
};
