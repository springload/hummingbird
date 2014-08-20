var Layout = require("./Layout");

module.exports = Layout.extend({
    template: "app/templates/title-with-content.nunj",
    regions: {
        content: "[data-content]",
        title: "[data-title]"
    }
});