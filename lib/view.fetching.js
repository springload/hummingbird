var View = require("./View");

module.exports = View.extend({
    template: "app/templates/view.fetching.nunj",
    tagName: "div",
    className: "ui_empty ui_fetching",
    type: "fetching"
});