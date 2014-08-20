var Carousel = require("./ui.carousel");

module.exports = Marionette.ItemView.extend({

    template: "app/templates/carousel.nunj",

    initialize: function (options) {
        var skipLabel = this.firstShowGuide ? "Skip" : "Close";
        this.model = new Backbone.Model({skipLabel: skipLabel});
        this.firstShowGuide = false;
    },

    events: {
        "UICarouselPageSelect .ui_carousel" : "changeButtonText",
        "click [data-next-item]": "showNextItem"
    },

    triggers: {
        "click [data-close]": "navigate:back"
    },

    ui: {
        "carousel": ".ui_carousel"
    },

    showNextItem: function(e) {
        this.carousel.nextItem();
    },

    serializeData: function() {
        var data = this.model ? this.model.toJSON() : new Backbone.Model({}).toJSON({});
        data.back = this.back;
        return data;
    },

    onRender: function() {
        this.carousel = new Carousel(this.ui.carousel.get(0));
    },

    changeButtonText: function(e) {
        var isLastPage = (e.originalEvent.index === e.originalEvent.total);
        var closeButton = this.$el.find("[data-close]");
        var nextButton = this.$el.find("[data-next-item]");
        var btnText = this.model.get("skipLabel"); //"Skip";
        var btnTextDone = "Start using the app";

        // Changing button text
        if(isLastPage && closeButton.html() === btnText){
            closeButton.html(btnTextDone);
            closeButton.removeClass('button-tertiary').addClass('button-secondary');
            nextButton.css({'display':'none'});
        } else if(!isLastPage && closeButton.html() === btnTextDone) {
            closeButton.html(btnText);
            closeButton.removeClass('button-secondary').addClass('button-tertiary');
            nextButton.css({'display':'inline-block'});
        }
    }
});
