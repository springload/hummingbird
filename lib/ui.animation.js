var Animation = function(opts) {
    var defaults = {
        animatedClass: "ui_animated",
        animationEvent: "webkitAnimationEnd"
    };

    if (arguments.length) {
        var options = _.extend({}, defaults, opts);
        this.options = options;
    }

    return this;
};

Animation.prototype = {
    prepare: function() {
        var self = this;
        var dfd = new jQuery.Deferred();
        var view = this.options.view;

        // Append animated element to the DOM
        if (self.options.shouldAppendView) {
            view.$el.on("DOMNodeInserted", function(e) {
                $(this).off("DOMNodeInserted");
                dfd.resolve(self);
                self.onNodeInserted();
            });
            view.$el.on("webkitAnimationEnd", function(e) {
                if (e.originalEvent.animationName === "nodeInserted") {
                    $(this).off("webkitAnimationEnd");
                    dfd.resolve(self);
                    self.onNodeInserted();
                }
            });

            view.render();
            this.options.context.$el.append(view.$el);

        } else {
            dfd.resolve(self);
        }

        return dfd.promise();
    },

    cleanupAnimation: function(e) {

        var self = this;
        var view = e.data.view;
        var isAnimComplete = view.$el.hasClass(this.options.animatedClass);
        var callback = self.options.callback;

        if (isAnimComplete) {

            view.$el.removeClass(this.options.animatedClass + " " + this.options.animationClass);

            if (this.options.shouldHideView) {
                view.$el.addClass("ui_stack_hidden");
            }
            if (self.options.shouldUsePositionAbsolute) {
                view.$el.removeClass("ui_animated_absolute");
            }

            view.$el.off(this.options.animationEvent);

            if (callback) {
                callback();
            }

            self.dfd.resolve(self);

            if(self.options.shouldCloseView) {
                this.close(view);
            } else {
                this.close();
            }
        }
    },

    onNodeInserted:  function() {
        if (this.nodeInserted) return;
        this.nodeInserted = true;
        this.options.context.trigger("onNodeInserted");
        this.options.context.$el.off("DOMNodeInserted");
    },

    close: function(view) {
        if (view) {
            view.$el.off(this.options.animationEvent);
            if(typeof(view["close"]) === "function") {
                view.close();
                view.remove();
            } else {
                view.$el.remove();
            }
        }
    },

    run: function() {
        var view = this.options.view;
        var self = this;
        var delay = 0;
        var animationEndEvent = self.options.animationEvent;
        var eventData = {
            self: this.options.context,
            view: view,
            animatedClass: self.options.animatedClass
        };

        this.dfd = new jQuery.Deferred();

        Marionette.triggerMethod.call(this.options.view, "before:transition:in");

        if (self.options.shouldUsePositionAbsolute) {
            view.$el.addClass("ui_animated_absolute");
        }

        if (view.$el.hasClass("ui_stack_hidden")) {
            view.$el.removeClass("ui_stack_hidden");
        }

        // Bind one-shot events
        view.$el.off(animationEndEvent).on(animationEndEvent, eventData, function(e) {
            //console.log(view.$el.attr("class"));
            if (e.originalEvent.animationName !== "nodeInserted") {
                self.cleanupAnimation.call(self, e);
            }
        });

        view.$el.addClass(self.options.animationClass + " " + self.options.animatedClass);

        view.previousTransitionClass = self.options.animationClass;

        // The delay breaks in ios5. Not sure why. Maybe it takes
        // too long to set the timer and fire it.
        // delay = APP.animation.getAnimationDuration(view.$el);
        //console.log("delay:: " + delay);

        //Fire a timeout if the animationEnd event fails.
        // setTimeout(function() {
        //     if (!self.options) {
        //         return false; // Options don't exist.. so the animation is finished.
        //     }

        //     var stillAnimating = view.$el.hasClass(self.options.animatedClass);

        //     if (stillAnimating) {
        //        self.cleanupAnimation.call(self, {data: eventData});
        //     }
        // }, delay+100);

        return this.dfd.promise();
    }
};


module.exports = Animation;