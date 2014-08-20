var Browser = require("./browser");

module.exports = Marionette.ItemView.extend({
    template: Browser.tablet() ? "app/templates/view.title.tablet.nunj" : "app/templates/view.title.mobile.nunj"
});