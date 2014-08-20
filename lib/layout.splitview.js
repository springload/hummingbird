var TransitionRegion = require("./region.transition");
var AnimationController = require("./animation");
/**
 * SplitView is a classic iPad view - it's a list on the left,
 * and an enlarged detail on the right. The list doesn't have
 * to be a list, it can really be anything you like, it's
 * just the idiom we use to talk about it.
 */
module.exports = Marionette.LayoutView.extend({
    activeItemSelector: "splitview_active",
    template: "app/templates/split-view.nunj",
    className: "ui_splitview",
    regions: {
        main:{
            selector: ".ui_splitview_detail",
            regionType: TransitionRegion
        },
        list:{
            selector: ".ui_splitview_list",
            regionType: TransitionRegion
        },
        title: {
            selector: ".ui_title_bar",
            regionType: TransitionRegion
        },
        overlays: {
            selector: "[data-overlays]",
            regionType: TransitionRegion
        }
    },
    initialize: function() {
        // empty method...
    },
    select: function(name) {

        if (!this.list || !this.list.$el) return;

        var previous = this.$el.find("." + this.activeItemSelector);
        var item = this.$el.find("[data-list-id='" + name + "']");
        previous.removeClass(this.activeItemSelector);
        item.addClass(this.activeItemSelector);
        this.$el.find("[data-list-id]").removeClass("active");
    },
    highlightListItem: function(e){
        e.stopPropagation();
        e.preventDefault();
        var name = e.currentTarget.dataset.listId;
        this.select(name);
        window.location.hash = e.currentTarget.hash;
        return false;
    },
    events: {
        "click [data-list-id]": "highlightListItem"
    },
    onRender: function () {

        if (this.listView) {
            this.list.show(this.listView);
        }
        if (this.mainView) {
            this.main.show(this.mainView);
        }
    },
    onShow: function(){
        this.delegateEvents();
    },
    onClose: function(){
        if (this.listView) {
            this.listView.close();
        }
        if (this.mainView) {
            this.mainView.close();
        }
    }
});