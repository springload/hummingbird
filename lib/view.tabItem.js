module.exports = Marionette.ItemView.extend({
    template: "app/templates/view.tabs.nunj",
    tagName: "li",
    className: "ui_tab",

    modelEvents: {
        "change": "updateUI"
    },

    onShow: function() {
        this.updateUI();
    },

    updateUI: function() {
        var name = this.model.get("name");
        var disabled = this.model.get("disabled");
        var id = this.model.get("id");
        var classes = this.model.get("class");
        var current = this.model.get("current");
        var icon = this.model.get("icon");
        var removeClasses = "";
        var addClasses = "";

        if (classes) {
            addClasses = classes;
        }

        if (current) {
            addClasses += " current";
        } else {
            removeClasses += " current";
        }

        if (disabled) {
            addClasses += " ui_disabled";
        } else{
            removeClasses += " ui_disabled";
        }

        this.$el.addClass(addClasses).removeClass(removeClasses);

        if (name) {
            this.$el.attr("data-name", name);
        }

        if (id) {
            this.$el.attr("id", id);
        }

    }
});
