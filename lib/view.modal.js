var TransitionView = require("./view.transition");

module.exports =  TransitionView.extend({
    className: "block--modal block--padding",
    serializeData: function() {
        var data = {};
        data.state = APP.state;
        return data;
    }
});


