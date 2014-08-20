var Animation = require("./ui.animation");

/**
 * Animation Controller
 *
 * Fires an animation queue via promises.

 * @type {Object}
 */

module.exports = {

    waitForElementsToRender: 100, //ms
    queue: [],

    getDuration: function(el, prop) {
        var duration = el.css(prop + "-duration");
        var delay = el.css(prop + "-delay");
        var total = this.milli(delay) + this.milli(duration);
        return total;
    },

    getAnimationDuration: function(el) {
        if (el) {
            return this.getDuration(el, "-webkit-animation");
        }
        return 600;
    },

    getTransitionDuration: function(el) {
        if (el) {
            return this.getDuration(el, "-webkit-transition");
        }
        return 600;
    },

    /**
     * Converts a transition time (or array) to a sensible integer value.
     * @param  {Number} val : the incoming transition time, e.g. 0.3490000000
     * @return {Integer}    : a clean base10 int.
     */
    milli: function(val) {
        var _val = val.split(",")[0];
        return parseInt (_val.substring(0, _val.length - 1)*1000, 10);
    },

    /**
     * Factory for making animations. Takes an options hash.
     */
    create: function(options) {
        if (!options) return;
        return new Animation(options);
    },

    /**
     * Runs the actual animations once DOM nodes are ready.
     * @param  {Array} animations   [An array of $.Deferred objects]
     * @return {void}
     */
    run: function(animations, callback) {
        var self = this;
        var deferredObjects = [];
        var shouldPreventInteractions = false;

        for (var n = 0; n < animations.length; n++) {

            if (animations[n].options.shouldPreventUserInteraction) {
                shouldPreventInteractions = true;
            }

            deferredObjects.push( animations[n].prepare() );
        }

        vent.trigger("animation:start");

        if (shouldPreventInteractions) {
            vent.trigger("animation:interaction:prevent");
        }

        // Prevent memory leaks by setting an arbitrary limit on
        // the length of the queue.
        if (self.queue.length > 32) {
            self.queue = [];
        }

        // Apply the deferred objects array to $.when so it
        // can accept any number of animations.
        $.when.apply(null, deferredObjects).done(function() {
            var args = arguments;
            if(args.length) {
                if (callback) {
                    callback();
                }
                for (var i = 0; i < args.length; i++) {
                    self.queue.push( args[i].run() );
                }
            }
           Util.repaint();
        });

        $.when.apply(null, self.queue).done(function(){
            if (self.queue.length) {
                self.queue = [];
                vent.trigger("animation:complete");
            }
            if (shouldPreventInteractions) {
                vent.trigger("animation:interaction:allow");
            }
        });
    },
    end: function(){

    }
};