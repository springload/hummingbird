module.exports = Marionette.LayoutView.extend({
    template: "app/templates/title-with-content.nunj",
    regions: {
        content: "[data-content]",
        title: "[data-title]"
    }
});