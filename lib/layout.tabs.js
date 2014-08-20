var TransitionRegion = require("./region.transition");
var AnimationController = require("./animation");

module.exports = Marionette.LayoutView.extend({

    template: "app/templates/layout.tabs.nunj",

    className: "ui_tabview",

    regions: {
        title: {
            selector: ".ui_title_bar"
        },
        main: {
            regionType: TransitionRegion,
            selector: ".content"
        },
        sheet: {
            regionType: TransitionRegion,
            selector: ".sheet"
        },
        tabs: {
            regionType: TransitionRegion,
            selector: ".tabs"
        },
        overlays: {
            regionType: TransitionRegion,
            selector: ".overlays"
        }
    },

    initialize: function(options) {
        if (options.tabView) {
            this.tabView = options.tabView;
        }

        if (options.mainView) {
            this.mainView = options.mainView;
        }

        if (options.titleView) {
            this.titleView = options.titleView;
        }

        if (this.onInitialize) {
            this.onInitialize(options);
        }
    },

    onShow: function() {
        this.delegateEvents();

        if (this.tabView) {
            if (this.tabs.currentView !== this.tabView) { // re-rendering no more.
                this.tabs.show(this.tabView); // Re -rendering!!? :(
            }
        }

        if (this.mainView) {
            //console.log("render main view", this.mainView);
            if (this.main.currentView !== this.mainView) {
                this.main.show(this.mainView);
            }
        }

        if (this.titleView) {
            if (this.title.currentView !== this.titleView) {
                this.title.show(this.titleView);
            }
        }
    }
});