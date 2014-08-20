var TransitionRegion = require("./region.transition");
var AnimationController = require("./animation");
var Transitions = require("./ui.transitions");

/**
 * Returns the last member of an array
 * @param array
 * @returns {*}
 */
var getLast = function(array) {
    if ( array.length > 0 )
        return array[ array.length - 1 ];
    else
        return undefined;
};

/**
 * Push views on and off a 'stack' while persisting their state.
 */

module.exports = Marionette.View.extend({

    hasRootView: false,

    // Define options for transitioning views in and out
    defaults: {
        inTransitionClass: 'aSlideFadeInFromRight',
        outTransitionClass: 'aSlideFadeOutToRight',
        inTransitionPrevClass: "aSlideFadeInFromLeft",
        outTransitionPrevClass: "aSlideFadeOutToLeft",
        animationClass: 'ui_animated',
        className: 'ui_stack ui_scroll_content',
        itemClass: 'ui_stack_item view'
    },

    initialize: function(options) {
        this.views = [];
        options = options || {};
        this.options = _.extend(_.defaults({}, this.defaults), options);
    },

    setRootView: function(view, options) {
        this.hasRootView = true;
        var oldView = this.views[0] || null;
        this.views = [];
        this.views.push(view);
        var options = options || {};

        if (options.transition) {
            options.shouldCloseOldView = true;
            this.transitionViewIn(view, oldView, options);
        } else {
            // Only re-render the view if it's not visible.
            if (!view._isShown) {
                this.$el.empty();
                view.render();
                this.$el.append(view.$el);
            }
            view.trigger("show");
        }
        view.$el.addClass(this.options.itemClass);
    },

    render: function() {
        this.$el.addClass(this.options.className);
        this.isClosed = false;
        this.triggerMethod("before:render", this);
        this.triggerMethod("stack:before:render", this);
        this.bindUIElements();
        this.triggerMethod("render", this);
        this.triggerMethod("stack:rendered", this);
    },

    onRender: function () {
        // console.log('StackView: onRender', this.$el);
    },

    empty: function() {
        if (this.views.length > 0) {
            for(var i = 0; i < this.views.length; i++) {
                this.views[i].close();
            }
            this.$el.empty();
            this.views = [];
        }
    },

    // Pop the top-most view off of the stack.
    pop: function(options) {
        var self = this;
        var transition = false;
        var options = options || {};

        if (this.isTransitioning) {
            return false;
        }

        if (this.views.length > (this.hasRootView ? 1 : 0)) {
            var view = this.views.pop();
            var newView = getLast(this.views);
            if (options.transition || this.useDefaultTransitions) {
                this.transitionViewOut(view, newView, options);
            } else {
                newView.$el.removeClass("ui_stack_hidden");
                view.close();
            }
        }
    },

    // Push a new view onto the stack.
    // The itemClass will be auto-added to the parent element.
    push: function(view, options) {
        var self = this;
        var oldView = getLast(this.views);
        var transition = false;


        if (!this.views.length) {
            this.setRootView(view, options);
            return;
        }

        // Don't push the same view onto the stack twice, or push another view
        // if a transition is already underway.
        if (this.isTransitioning || oldView === view) {
            return false;
        }

        if (options) {
            transition = options.transition;
        }

        var hash = ""; //TODO: APP.State.get("hash");
        view.hash = hash;

        this.views.push(view);

        if (transition || this.useDefaultTransitions) {
            this.transitionViewIn(view, oldView, options);
        } else {
            if (oldView) {
                oldView.$el.addClass("ui_stack_hidden");
            }
            view.render();
            this.$el.append(view.$el);
            view.$el.addClass(self.options.itemClass);
        }
    },

    // Transition the new view in.
    // This is broken out as a method for convenient overriding of
    // the default transition behavior. If you only want to change the
    // animation use the trasition class options instead.
    transitionViewIn: function(view, oldView, options) {
        var self = this;
        var inTransition, outTransition;
        var transition = false;
        var shouldCloseOldView = false;
        var shouldPreventUserInteraction = false;
        var options = options || {};

        if (options.transition) {
            transition = options.transition;
        }

        if (options.shouldCloseOldView) {
            shouldCloseOldView = options.shouldCloseOldView;
        }

        if (typeof(options.shouldPreventUserInteraction) !== "undefined") {
            shouldPreventUserInteraction = options.shouldPreventUserInteraction;
        }

        this.trigger("before:transitionIn", this, view);

        if (transition) {
            inTransition = Transitions.getTransitionInClass(transition);
            outTransition = Transitions.getTransitionOutClass(transition);
        } else {
            inTransition = this.options.inTransitionClass;
            outTransition = this.options.outTransitionPrevClass;
        }

        var anim = AnimationController.create({
            view: view,
            context: this,
            animationClass: inTransition,
            shouldAppendView: true, // new view needs to be inserted into DOM.,
            shouldPreventUserInteraction: shouldPreventUserInteraction,
            callback: function(e) {
                // console.log("StackView: New View finished: ", +new Date());
                Marionette.triggerMethod.call(view, "transition:in");
                Marionette.triggerMethod.call(view, "show");
                vent.trigger("animation:interaction:allow");
                self.isTransitioning = false;
            }
        });


        if (oldView) {
            var oldViewAnim = AnimationController.create({
                view: oldView,
                context: this,
                animationClass: outTransition,
                shouldHideView: true,
                shouldCloseView: shouldCloseOldView,
                shouldPreventUserInteraction: shouldPreventUserInteraction,
                callback: function(e) {
                    Marionette.triggerMethod.call(oldView, "transition:out");
                }
            });

            this.trigger("before:transitionOut", this, view);

            if (!options.serialTransition) {
                AnimationController.run([oldViewAnim, anim]);
            } else {
                // one after the other...
                this.listenToOnce(oldView, "transition:out", function() {
                    //console.log("StackView: OLD VIEW FINISHED", +new Date());
                    AnimationController.run([anim]);
                });
                //console.log("StackView: Start Transition: Series", +new Date());
                AnimationController.run([oldViewAnim]);
            }

        } else {
            //console.log("StackView: Start Transition", +new Date());
            AnimationController.run([anim]);
        }

        self.isTransitioning = true;

    },

    // Trastition a view out.
    // This is broken out as a method for convenient overriding of
    // the default transition behavior. If you only want to change the
    // animation use the trasition class options instead.
    transitionViewOut: function(view, newView, options) {
        var self = this;
        var options = options || {};
        var deferRender = true;
        var transition = false;
        var shouldPreventUserInteraction = false;

        if (options.transition) {
            transition = options.transition;
        }

        if (transition) {
            inTransition = Transitions.getTransitionInClass(transition);
            outTransition = Transitions.getTransitionOutClass(transition);
        } else {
            inTransition = this.options.inTransitionPrevClass;
            outTransition = this.options.outTransitionClass;
        }

        if (typeof(options.shouldPreventUserInteraction) !== "undefined") {
            shouldPreventUserInteraction = options.shouldPreventUserInteraction;
        }

        this.trigger("before:transitionOut", this, view);

        Backbone.Marionette.triggerMethod.call(view, "before:transition:out");

        var newViewAnim;
        var anim = AnimationController.create({
            view: view,
            context: this,
            animationClass: outTransition,
            shouldCloseView: true,
            shouldPreventUserInteraction: shouldPreventUserInteraction,
            callback: function(e) {
                self.trigger("transitionOut", self, view);
                Marionette.triggerMethod.call(view, "transition:out");
                self.isTransitioning = false;
            }
        });

        if (view.hash) {
            vent.trigger('navigate:hash', view.hash);
        }

        if (newView) {
            //console.log("newView:: ", newView);
            newViewAnim = AnimationController.create({
                view: newView,
                context: this,
                shouldAppendView: false, // view is already in DOM!
                animationClass: inTransition,
                shouldPreventUserInteraction: shouldPreventUserInteraction,
                callback: function(e) {
                    Marionette.triggerMethod.call(newView, "transition:in");
                }
            });

            if (!options.serialTransition) {
                AnimationController.run([newViewAnim, anim]);
            } else {
                //console.log("SERIAL TRANSITION", +new Date());
                // one after the other...
                this.listenToOnce("transition:out", function() {
                    //console.log("OLD VIEW FINISHED", +new Date());
                    AnimationController.run([newViewAnim]);
                });

                AnimationController.run([anim]);
            }

        } else {
            AnimationController.run([anim]);
        }
        this.isTransitioning = true;
    },

    onBeforeClose: function() {
        var self = this;
        _.each(self.views, function(item) {
            // It's a bit low-level. But works. Hmm...
            item.close();
            item._isShown = false;
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
            var anim = AnimationController.create({
                view: this,
                context: this,
                animationClass: Transitions.getTransitionOutClass(options.transition),
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