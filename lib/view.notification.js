/**
 * Notification is a generic banner message you can throw up in your application to
 * alert users to take a specific action.
 * Triggers an event on the global event space when clicked.
 * Can be dismissed by triggering `UI:Notification:CloseAll`
 */
module.exports =  Marionette.ItemView.extend({

    className: "ui_notification",
    tagName: "div",
    animation: "transition_bounce",
    inDuration: 100,
    template: "app/templates/notification.nunj",
    timeout: 15000000, // go away after 10 sec
    stop_notifications: true,

    initialize: function(opts) {
        var _this = this;

        if (opts) {
            _.extend(this, opts);
        }

        _.bindAll(this, "close");

        this.listenTo(vent, "UI:Notification:CloseAll", this.closeNochangeNotifiedTimes);

        setTimeout(function() {
            _this.el.classList.add("animate_in");
        }, 50);

        this.closeTimer = setTimeout(function() {
            _this.closeNochangeNotifiedTimes();
        }, this.timeout);
    },

    events: {
        "touchend": "triggerLink",
        "touchend .ui_close_area": "dismiss"
    },

    closeNochangeNotifiedTimes: function() {
        this.stop_notifications = false;
        this.close();
    },

    onShow: function() {
        this.el.classList.add(this.animation);
    },

    triggerLink: function (e) {
        e.preventDefault();
        e.stopPropagation();
        vent.trigger("UI:Notification:Click", { title: this.model.get("copy"), url: this.model.get("link") });
        this.close();
    },

    dismiss: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.close();
    },

    close: function(e) {
        if(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        var _this = this;

        this.el.classList.remove("animate_in");

        setTimeout(function() {
            _this.remove();
        }, 500);

        vent.trigger("UI:Notification:Close", this);

        // Make sure the timer is cleaned up.
        clearTimeout(this.closeTimer);
    }
});