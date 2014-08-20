var View = require("./View");

module.exports = View.extend({
    template: "app/templates/view.empty.nunj",
    tagName: "div",
    className: "ui_empty",
    initialize: function(options) {
        if (this.model) {
            this.model.set("message", options.emptyMessage);
        }
    }
});