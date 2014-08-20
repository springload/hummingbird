/**
 * Create a custom Morionette Region. Instead of simply replacing the
 * contents with a new view when calling show(), we add the new view
 * off-screen and transition the region to show the new view.
 *
 * When the transition is done the region is reset to it's original location.
 *
 */
module.exports = Marionette.Region.extend({

    transitionComplete: function(newView) {
        var self = this;
        self.isTransitioning = false;
        self.currentView = newView;
    },

    beforeTransition: function(view){
        var self = this;
    },

    // Very similar to show(), but uses css transition class between views
    transitionToView: function(newView, options) {

        this.ensureEl();

        var self = this;
        var oldView = this.currentView;
        var newViewCallBack = false;
        var deferRender = true;
        var type = "fade";
        var options = options || {};
        var shouldUsePositionAbsolute = true;
        var shouldPreventUserInteraction = false;

        if (self.isTransitioning || newView === oldView) {
            return false;
        }

        if (options.newViewCallBack){
            newViewCallBack = options.newViewCallBack;
        }

        if (typeof(options.shouldPreventUserInteraction) !== "undefined") {
            shouldPreventUserInteraction = options.shouldPreventUserInteraction;
        }

        if (options.relative) {
            shouldUsePositionAbsolute = false;
        }

        if (options.transition){
            type = options.transition;
        }

        if (!type) {
            type = "fade";
        }

        if (!oldView || oldView.isClosed) {
            this.close();
        }

        Marionette.triggerMethod.call(this, "before:transitionToView", oldView);

        var anim = AnimationController.create({
            view: newView,
            context: this,
            animationClass: Transitions.getTransitionInClass(type),
            shouldAppendView: true, // new view needs to be inserted into DOM.
            shouldUsePositionAbsolute: shouldUsePositionAbsolute,
            callback: function(e) {
                Marionette.triggerMethod.call(newView, "transition:in");
                Marionette.triggerMethod.call(newView, "show");
//                    Marionette.triggerMethod.call(APP.layoutManager.get("root").$el, "animation:interaction:allow");
                if (newViewCallBack) {
                    newViewCallBack();
                }
                self.transitionComplete(newView);
            }
        });

        if (oldView) {
            var oldViewAnim = AnimationController.create({
                view: oldView,
                context: this,
                animationClass: Transitions.getTransitionOutClass(type),
                shouldCloseView: true,
                shouldUsePositionAbsolute: true,
                shouldPreventUserInteraction: shouldPreventUserInteraction,
                callback: function(e) {
                    Marionette.triggerMethod.call(oldView, "transition:out");
                    Marionette.triggerMethod.call(oldView, "close");
                }
            });

            if (options.serialTransition) {
                AnimationController.run([oldViewAnim]);
                this.listenToOnce(oldView, "transition:out", function() {
                    self.beforeTransition.call(self, newView);
                    AnimationController.run([anim]);
                });
            } else {
                AnimationController.run([oldViewAnim, anim], function(){
                });
            }
            Marionette.triggerMethod.call(oldView, "before:transition:out");
        } else {
            AnimationController.run([anim], function(){
                self.beforeTransition.call(self, newView);
            });
        }

        Marionette.triggerMethod.call(newView, "before:transition");

        self.currentView = newView;
        this.isTransitioning = true;
    },

    transitionOut: function(options) {
        var self = this;
        var transition = options.transition || "fade";
        var shouldPreventUserInteraction = options.shouldPreventUserInteraction || false;
        var oldView = this.currentView;

        if (!oldView) {
            this.close();
            return;
        }

        var oldViewAnimation = AnimationController.create({
            view: oldView,
            context: this,
            animationClass: Transitions.getTransitionOutClass(transition),
            shouldCloseView: true,
            shouldUsePositionAbsolute: true,
            shouldPreventUserInteraction: shouldPreventUserInteraction,
            callback: function(e) {
                Marionette.triggerMethod.call(oldView, "transition:out");
                Marionette.triggerMethod.call(oldView, "close");
                Marionette.triggerMethod.call(self, "close");
                self.onExitingViewClose();
            }
        });


        AnimationController.run([oldViewAnimation], function(){
            self.beforeTransition.call(self, oldViewAnimation);
        });
        Marionette.triggerMethod.call(oldView, "before:transition:out");
    },

    onExitingViewClose: function() {
        var self = this;
        self.close();
        self.isTransitioning = false;
    }
});