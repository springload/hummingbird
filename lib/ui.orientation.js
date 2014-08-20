/**
 * Determine the screen orientation relative to gravity
 * Uses the hardware accelerometer API
 *
 * @param listener
 * @constructor
 */
var Orientation = function (listener) {
    var _scope = this;

    if (listener) {
        this.listener = listener;
    }

    if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", this, false);
    }

    clearInterval(this._interval);

    this._interval = setInterval(function(e) {
        _scope.motion();
    }, this.listenerInterval);

    this.doEvent(0);
};

Orientation.prototype = {
    lastOrientation: {a:0, b: 0, g: 0, c: 0},
    currentMotion: {x: 0, y: 0, z: 0, g: 0},
    listenerInterval: 50, // ms
    minTimeAtAngle: 600, // ms before we trigger the orientation event
    lastAngle: 0, // deg
    angle: 0, // assume it's portrait by default.
    count: 0, // number
    minGravityForOrientation: 9, //m/sec^2
    eventFired: false,

    handleEvent: function(e) {
        if(e.type === "devicemotion") {
                this.currentMotion.x = e.accelerationIncludingGravity.x;
                this.currentMotion.y = e.accelerationIncludingGravity.y;
                this.currentMotion.z = e.accelerationIncludingGravity.z;
        }
    },

    motion: function() {
        var x = this.currentMotion.x;
        var y = this.currentMotion.y;
        var g = this.minGravityForOrientation;

        if (x > g) {
            this.angle = -90;
        } else if(x < -g) {
            this.angle = 90;
        } else if (y < -g) {
            this.angle = 0;
        } else if (y > g) {
            this.angle = 180;
        }

        if(this.lastAngle === this.angle) {
            if(this.count * this.listenerInterval >= this.minTimeAtAngle) {
                this.doEvent(this.angle);
                this.count = 0;
            } else {
                this.count++;
            }
        } else {
            this.eventFired = false;
            this.lastAngle = this.angle;
        }
    },

    doEvent: function(angle) {

        if (this.eventFired) return;

        this.dispatch("UI:Orientation:Change", angle);

        // convenient other events...
        if (angle === 0 || angle === 180 || angle === -180) {
            this.dispatch("UI:Orientation:Portrait", angle);
            // //console.log("event fired! Portrait");
        }

        if (angle === 90 || angle === 270 || angle === -90) {
            this.dispatch("UI:Orientation:Landscape", angle);
            // //console.log("event fired! Landscape");
        }

        this.eventFired = true;
    },

    dispatch: function(name, angle) {
        var e = document.createEvent("Event");
        e.angle = angle;
        e.initEvent(name, true, true);
        window.dispatchEvent(e);

        // If we've got backbone and a global event object (why, we do!)
        // then trigger a backbone event as well.

        // if (this.listener) {
        //     this.listener.trigger(name, {angle: angle});
        // }
        // TODO: Fix this global export reliance on APP.
        if(Backbone && APP.global_events) {
            APP.global_events.trigger(name, {angle: angle});
        }
    },

    destroy: function() {
        this.listener = false;
        clearInterval(this._interval);
    }
};

module.exports = Orientation;