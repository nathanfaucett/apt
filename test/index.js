var tape = require("tape"),
    apt = require(".."),
    TodoStore = require("./TodoStore");


var Application = apt.Application;


tape("Application", function(assert) {
    var application = new Application(),
        todoStore = new TodoStore(application),
        json;

    application.registerStore(todoStore);

    application.dispatchAction({
        type: todoStore.consts.CREATE,
        text: "Do this"
    });
    application.dispatchAction({
        type: todoStore.consts.CREATE,
        text: "Do that"
    });

    json = application.toJSON();

    todoStore.all(function onAll(error, todos) {
        if (error) {
            assert.end(error);
        } else {
            assert.deepEquals(todos, [{
                id: 1,
                text: "Do this"
            }, {
                id: 2,
                text: "Do that"
            }]);
        }
    });

    application.dispatchAction({
        type: todoStore.consts.UPDATE,
        id: 2,
        text: "Already did that"
    });
    todoStore.show(2, function onShow(error, todo) {
        if (error) {
            assert.end(error);
        } else {
            assert.deepEquals(todo, {
                id: 2,
                text: "Already did that"
            });
        }
    });

    application.dispatchAction({
        type: todoStore.consts.DELETE,
        id: 2
    });
    todoStore.all(function onAll(error, todos) {
        if (error) {
            assert.end(error);
        } else {
            assert.deepEquals(todos, [{
                id: 1,
                text: "Do this"
            }]);
        }
    });

    application.fromJSON(json);

    todoStore.all(function onAll(error, todos) {
        if (error) {
            assert.end(error);
        } else {
            assert.deepEquals(todos, [{
                id: 1,
                text: "Do this"
            }, {
                id: 2,
                text: "Do that"
            }]);
        }
    });

    assert.end();
});