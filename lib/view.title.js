var Browser = require("./browser");
var View = require("./View");


module.exports = View.extend({
    template: Browser.tablet() ? "app/templates/view.title.tablet.nunj" : "app/templates/view.title.mobile.nunj"
});