var Browser = require("./browser");

module.exports = Marionette.ItemView.extend({

    tagName: "div",
    className: "ui_tab_search",
    template: "app/templates/view.search-form.nunj",

    ui: {
        search: "[data-input]",
        form: "[data-search-form]"
    },

    events: {
        "submit" : "doSearch",
        "click [data-trigger='submit-search']": "doSearch",
        "click [data-input]": "focusInput"
    },

    triggers: {
        "click [data-trigger='close-search']": "hide:search"
    },

    serializeData: function () {
        var r = {};

        if (this.model) {
            r = this.model.toJSON();
            r.search_query = this.model.search_query;
        }

        r.tablet = Browser.tablet();

        r.placeholder = this.placeholder;
        return r;
    },

    initialize: function (opt) {
        var self = this;
        self.placeholder = opt ? opt.placeholder || "Search" : "Search";
    },

    focusInput: function(e) {
        var self = this;
        if (e.fake) {
            self.ui.search.get(0).focus();
            self.ui.search.focus();
        }
    },

    doSearch: function(e) {
        var self = this;
        e.preventDefault();
        document.activeElement.blur();
        self.triggerMethod("search");
    },

    onShow: function() {
        this.delegateEvents();
        var self = this;

        self.ui.search.get(0).addEventListener("click", $.proxy(this.focusInput, this), false);

        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0,
            false, false, false, false, 0, null);
        evt.fake = true;
        self.ui.search.get(0).dispatchEvent(evt);

        this.triggerMethod("search:ready");
    },

    onBeforeClose: function() {
        var self = this;
        document.activeElement.blur();
        self.triggerMethod("search:close");
        self.ui.search.get(0).removeEventListener("click", $.proxy(self.focusInput, self), false);
    }
});