var TabItemView = require("./view.tab");

module.exports = Marionette.CompositeView.extend({
    itemView: TabItemView,
    className: "ui_tabs ui_tabs--left",
    tagName: "div",
    template: "app/templates/nav.nunj",
    itemViewContainer: ".ui_tabs_list",

    ui: {
        "tabs": ".ui_tab"
    },

    events: {
        "touchend .ui_tab": "setSelectedItem"
    },

    modelEvents: {
        "change:page": "select"
    },

    initialize: function(options) {
        this.state = new Backbone.Model({});

        this.collection = new Backbone.Collection();

        _.extend(this, options);

        if (!options) {
        } else {
            this.setTabs(options.tabs);
        }

        if (this.tabs) {
            this.setTabs(this.tabs);
        }
    },

    setTabs: function (tabArray) {
        if (!tabArray) {
            return;
        }

        var tabs = this.collection;
        var tabModel = Backbone.Model.extend({
            idAttribute: "name"
        });

        for (var i = 0; i < tabArray.length; i++) {
            tabs.add( new tabModel(tabArray[i]));
        }
    },

    selectByName: function(id) {
        var item = this.collection.get(id);
        this.select(item);
    },

    select: function(model) {
        var id, item, isCurrentItem, previous;

        id = model.get("page");
        previous = model.previous("page");
        item = this.collection.get(id);

        if (previous) {
            this.deselect(previous);
        }
        if (!item) {
            return;
        }

        isCurrentItem = item.get("current");

        if (!isCurrentItem) {
            item.set({current: true});
            this.state.set({item: id});
        }
    },

    deselect: function(id) {
        var item = this.collection.get(id);
        if (item) {
            item.set({current: false});
        }
    },

    setSelectedItem: function(e) {
        var target = $(e.currentTarget).data("name");
        var item = this.collection.get(target);
        var previous = this.state.get("item");

        if (item.get("disabled")) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        var id = item.get("name");
        if (this.model && typeof(this.model.select) !== "undefined") {
            this.model.select(id);
        }

        item.set({page: id});

        this.state.set({item: id});
    },

    enable: function(id) {
        var item = this.collection.get(id);
        item.set({disabled: false});
    },

    disable: function(id) {
        var item = this.collection.get(id);
        item.set({disabled: true});
    },

    onShow: function() {
        this.bindUIElements();
        this.delegateEvents();

        if (this.model) {
            this.listenTo(this.model, "change:page", this.select);
            this.select(this.model);
        }
    }
});