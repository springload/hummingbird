var AnimationController = require("./animation");
var Transitions = require("./ui.transitions");
var View = require("./View");

module.exports = View.extend({
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
                    return this;
                }
            });
            self.triggerMethod("transition:out");
            AnimationController.run([anim]);
        } else {
            remove();
        }
    }
});