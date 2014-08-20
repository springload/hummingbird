/**
 * Exports the Hummingbird library
 */
module.exports = {
    View: require('./lib/View'),
    Browser: require("./lib/browser"),
    AnimationController: require('./lib/animation'),
    TransitionRegion: require("./lib/region.transition"),
    Transitions: require('./lib/ui.transitions'),
    Orientation: require('./lib/ui.orientation'),
    Carousel: require('./lib/ui.carousel'),
    Animation: require('./lib/ui.animation'),
    AppLayout: require("./lib/layout.app"),
    ModalLayout: require("./lib/layout.modal"),
    SplitViewLayout: require("./lib/layout.splitview"),
    StackViewLayout: require("./lib/layout.stackview"),
    TabLayout: require("./lib/layout.tabs"),
    TitleContetLayout: require("./lib/layout.title-content"),
    EmptyView: require("./lib/view.empty"),
    ModalView: require("./lib/view.modal"),
    FetchingView: require("./lib/view.fetching"),
    ListItemView: require("./lib/view.list-item"),
    NotificationView: require("./lib/view.notification"),
    CarouselView: require("./lib/view.carousel"),
    TransitionView: require("./lib/view.transition"),
    TabView: require("./lib/view.tab-view"),
    TabItemView: require("./lib/view.tab-item"),
    TitleView: require("./lib/view.title")
};