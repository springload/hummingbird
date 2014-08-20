var TransitionRegion = require("./region.transition");
var AnimationController = require("./animation");


module.exports = Marionette.LayoutView.extend({
    contentActiveClass: "ui_viewport--modal-active",
    className: "ui_modal active",
    contentViewTransition: "scaleOutModal",
    template: 'app/templates/layout.modal.nunj',
    regions: {
        main: {
            selector: "[data-modal-content]",
            regionType: TransitionRegion
        }
    },
    events: {
        // TODO: check that swapping touchend and click events really is the solution to modals closing themselves.
        "click .ui-modal": "isolate",
        "touchend .ui-modal": "doClose",
        "touchend [data-btn-close]": "doClose",
        "click [data-modal-content]": "isolate",
        "touchend [data-modal-content]": "isolate"
    },
    isolate: function(e) {
        e.stopPropagation();
    },
    initialize: function(options) {
        _.extend(this, options);
    },
    doClose: function(e) {
        e.stopPropagation();
        e.preventDefault();
        this.main.currentView.remove({
            transition: this.contentViewTransition
        });
    },
    onClose: function() {
        // TODO: GLOBAL REF
//        vent.trigger("modal:close");
    },
    onShow: function() {

        // By default, transitions use position absolute, but this does
        // funny things with modals, since they're display table cell.
        this.main.transitionToView(self.contentView, {
            transition: self.showTransition,
            relative: true
        });


        // Bind a listener to the close event of the modal's content.
        // This lets us automatically clean-up when the content view
        // has determined it should close.
        this.listenTo(this.main.currentView, "close", this.removeActiveClass);


        // TODO: GLOBAL REF
        vent.trigger("modal:show");
    },

    removeActiveClass: function() {
        this.$el.removeClass("active");

        this.remove({
            transition: "reallyQuickFade"
        });
    },

    remove: function(options) {
        var self = this;
        var remove = function() {
            self.$el.remove();
            self.stopListening();
            self.close();
        };

        if (options && options.transition) {
            var transition = Transitions.getTransitionOutClass(options.transition);
            // console.log("remove: transition:", transition);
            var anim = AnimationController.create({
                view: this,
                context: this,
                animationClass: transition,
                shouldCloseView: true,
                shouldUsePositionAbsolute: false,
                callback: function(e) {
                    remove();
                    return this;
                }
            });

            AnimationController.run([anim]);

        } else {
            remove();
        }
    }
});


