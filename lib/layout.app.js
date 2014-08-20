var TransitionRegion = require("./region.transition");

module.exports = Marionette.LayoutView.extend({

    regions: {
        main: {
            regionType: TransitionRegion,
            selector: "[data-app-content]"
        },
        modals: {
            regionType: TransitionRegion,
            selector: "[data-app-modals]"
        },
        nav: {
            regionType: TransitionRegion,
            selector: "[data-app-nav]"
        },
        overlays: {
            regionType: TransitionRegion,
            selector: "[data-app-overlays]"
        }
    },

    template: 'app/templates/app.nunj',

    events: {
        'click [data-childbrowser-url]': 'handleChildBrowserClick',
        'click [href]': 'handleClick'
    },

    initialize: function(options) {

    },

    handleChildBrowserClick: function(e) {

    },

    handleClick: function(e) {

    }
});