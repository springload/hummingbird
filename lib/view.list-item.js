var Browser = require("./browser");

module.exports = Marionette.ItemView.extend({
    tagName: "div",
    template: Browser.tablet() ? "app/templates/list-item.tablet.nunj" : "app/templates/list-item.mobile.nunj",
    serializeData: function () {
        var data = this.model.toJSON();
        return data;
    }
});
