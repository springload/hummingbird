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
        "click .ui_modal--new": "isolate",
        "touchend .ui_modal--new": "doClose",
        "touchend [data-btn-close]": "doClose",
        "click [data-modal-content]": "isolate",
        "touchend [data-modal-content]": "isolate"
    },
    isolate: function(e) {
        e.stopPropagation();
    },
    initialize: function(options) {
        var self = this;
        _.extend(self, options);
    },
    doClose: function(e) {
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        self.main.currentView.remove({
            transition: self.contentViewTransition
        });
    },
    onClose: function() {
        vent.trigger("modal:close");
    },
    onShow: function() {
        var self = this;

        // By default, transitions use position absolute, but this does
        // funny things with modals, since they're display table cell.
        self.main.transitionToView(self.contentView, {
            transition: self.showTransition,
            relative: true
        });


        // Bind a listener to the close event of the modal's content.
        // This lets us automatically clean-up when the content view
        // has determined it should close.
        self.listenTo(self.main.currentView, "close", function() {
            this.$el.removeClass("active");

            self.remove({
                transition: "reallyQuickFade"
            });
        });

        vent.trigger("modal:show");
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


