(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./lib/View":2,"./lib/animation":3,"./lib/browser":4,"./lib/layout.app":5,"./lib/layout.modal":6,"./lib/layout.splitview":7,"./lib/layout.stackview":8,"./lib/layout.tabs":9,"./lib/layout.title-content":10,"./lib/region.transition":11,"./lib/ui.animation":12,"./lib/ui.carousel":13,"./lib/ui.orientation":14,"./lib/ui.transitions":15,"./lib/view.carousel":16,"./lib/view.empty":17,"./lib/view.fetching":18,"./lib/view.list-item":19,"./lib/view.modal":20,"./lib/view.notification":21,"./lib/view.tab-item":22,"./lib/view.tab-view":23,"./lib/view.title":24,"./lib/view.transition":25}],2:[function(require,module,exports){
module.exports = Marionette.ItemView.extend({
    onShow: function() {
        console.log("hummingview");
    }
});
},{}],3:[function(require,module,exports){
var Animation = require("./ui.animation");

/**
 * Animation Controller
 *
 * Fires an animation queue via promises.
 *
 *
 *
 *
 *
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
},{"./ui.animation":12}],4:[function(require,module,exports){
var determineTablet = function() {
    var tabletBreakpoint = 600; //px
    var userAgent = navigator.userAgent.toLowerCase();
    var isAppleTablet = userAgent.match(/(iPad)/);
    var isAndroidTablet = false;
    var shouldGetTabletViews = window.innerWidth > tabletBreakpoint;

    if ((userAgent.search("android") > -1) && !(userAgent.search("mobile") > -1)) {
        isAndroidTablet = true;
    }

    if (isAppleTablet || isAndroidTablet || shouldGetTabletViews) {
        return true;
    }

    return false;
};




module.exports = {
    // Convenience methods
    _isTouch: ("ontouchstart" in window),

    _touch_or_click: "click",

    isNative: function(){
        return this.isFileProtocol(); // && (this.iOS() || this.android());
    },

    tablet: function() {
        if (!this.isTablet) {
            this.isTablet = determineTablet();
        }
        return this.isTablet;
    },

    iOS: function(){
        return  String(navigator.platform).toLowerCase().match(/iphone|ipod|ipad/) !== null;
    },

    iPhone: function(){
        return  String(navigator.platform).toLowerCase().match(/iphone|ipod/) !== null;
    },

    iPad: function(){
        return  String(navigator.platform).toLowerCase().match(/ipad/) !== null;
    },

    android: function(){
        return String(navigator.platform).toLowerCase().match(/android/) !== null;
    },

    ripple: function(){
        return (window.device !== undefined && device.phonegap !== undefined)
    },

    isSimulator: function(){
        return String(navigator.platform).toLowerCase().match(/simulator/) !== null
    },

    isIOS7: function() {
        return !!(navigator.userAgent.match(/(iPad|iPhone|iPod);.*CPU.*OS 7_\d/i));
    },

    // Checks if the application is served over the file:// protocol (cordova) or
    // over an http/s deployment (testing environment)
    isFileProtocol: function() {
        return document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    }
};


},{}],5:[function(require,module,exports){
var TransitionRegion = require("./region.transition");


/**
     * App Layout
     * ----------
     *
     * Application layout is a global listener for click events that makes browsers
     * behave more like their native counterparts, emulating clicks based on touch
     * events. Pretty nifty but also pretty crazy.
     *
     * It responds to changes in the global state of the app.
     *
     */

module.exports = Marionette.LayoutView.extend({

        drag_threshold: 0, //pixels.
        prev_elem: null, //ms.
        double_click_time: 200, //ms. (how long it's perceived that iOS allows for a double tap)
        time_since_last_click: 0,
        first_click_time :0,
        list_locked: false,

        regions: {
            main: {
                regionType: TransitionRegion,
                selector: "[data-app-content]"
            },
            modals: {
                regionType: TransitionRegion,
                selector: "[data-app-modals]"
            },
            nav: {
                regionType: TransitionRegion,
                selector: "[data-app-nav]"
            },
            overlays: {
                regionType: TransitionRegion,
                selector: "[data-app-overlays]"
            }
        },

        template: 'app/templates/app.nunj',

        events: {
            'touchstart [data-trigger="main-nav"]': 'toggleNav',
            'touchstart .tappable': 'touchStart',
            'touchend .tappable': 'touchEnd',
            'touchmove .tappable': 'touchMove',
            'touchstart .button': 'touchStart',
            'touchend .button': 'touchEnd',
            'touchmove .button': 'touchMove',
            'touchstart .i': 'touchStart',
            'touchend .i': 'touchEnd',
            'touchmove .i': 'touchMove',
            'click [data-trigger="login"]': 'showSigninModal',
            'click [data-trigger="login-form"]': 'showSignInView',
            'click [data-childbrowser-url]': 'handleChildBrowserClick',
            'click [href]': 'handleClick'
        },



        /**
         * Bind touch listeners. Use vanilla ones, since jQUERY is a tortoise.
         * Edit: v2 is much quicker, have removed the native bindings.
         */
        initialize: function(options) {
            console.log(Templates);
//            var self = this;
//
//            self.model = new APP.models.State({
//                page: "nav-hidden"
//            });
//
//            // Listen to online/offline events from the env.
//            self.listenTo(APP, "offline", self.setOffline);
//            self.listenTo(APP, "online", self.setOnline);
//
//            self.listenTo(APP.global_events, "UI:Notification:Show", self.showNotification);
//            self.listenTo(self.model, "change:page", self.navigate);
        }
//
//        /**
//         * Called when either a StackView or a TransitionRegion fire a transition.
//         * This stops the user from being able to button-mash the interface/break
//         * stuff while the transition happens.
//         *
//         * It also sets up a timeout should both animationEnd events not get fired.
//         *
//         * Paranoia: lots of timers here.
//         */
//        onAnimationInteractionPrevent: function() {
//            var self = this;
//            self.$el.addClass("preventAndyHoveyEffect");
//                self.noInteractionTimeout = setTimeout(function() {
//                    self.$el.removeClass("preventAndyHoveyEffect");
//                }, 3000);
//                self.noInteractionTimeout2 = setTimeout(function() {
//                    self.$el.removeClass("preventAndyHoveyEffect");
//                }, 1000);
//                self.noInteractionTimeout3 = setTimeout(function() {
//                    self.$el.removeClass("preventAndyHoveyEffect");
//                }, 5000);
//                self.noInteractionTimeout4 = setTimeout(function() {
//                    self.$el.removeClass("preventAndyHoveyEffect");
//                }, 10000);
//    //        console.log("prevent AndyHovey");
//        },
//
//        onAnimationInteractionAllow: function() {
//            var self = this;
//            this.$el.removeClass("preventAndyHoveyEffect");
//    //        if (self.noInteractionTimeout) {
//    //            clearTimeout(self.noInteractionTimeout);
//    //            self.noInteractionTimeout = false;
//    //        }
//        },
//
//        /**
//         * Display Login modal
//         */
//        showSigninModal: function(firstEvent) {
//            var self = this;
//
//            var login = APP.views.Modal.extend({
//                template: function() {
//                    if(APP.state.logged_in) {
//                        return Handlebars.compile("<p>You need to be a client of Forsyth Barr to access this Research. Talk to your adviser or Forsyth Barr on <span class='text--nowrap'>0800 367 227.</span></p><a data-btn-close class='button button--block button-cancel button--margin'>Close</a>");
//                    }
//                    return Handlebars.compile("<p>You need to be a client of Forsyth Barr to access this Research.</p><a data-btn-close class='button button-cancel button--margin'>Cancel</a><a data-btn-signin class='button button-positive button--margin'>Sign in</a>");
//                },
//
//                events: {
//                    "touchend [data-btn-signin]": "signin"
//                },
//
//                signin: function (e) {
//                    self.showSignInView();
//                    this.remove();
//                    e.preventDefault();
//                }
//            });
//
//            var modalContent = new login({
//                className: "block--modal block--padding"
//            });
//
//            var modal = new APP.layouts.Modal({
//                contentView: modalContent,
//                showTransition: "scaleInModal",
//                hideTransition: "scaleOutModal"
//            });
//
//            APP.layoutManager.layout.modals.show(modal);
//        },
//
//        showSignInView: function() {
//            var self = this;
//            var appLayout = APP.layoutManager.get("root");
//            var v = new APP.views.SignInView({
//                closeButton: true,
//                backButton: false,
//                className: "view theKeeperOfTheSecrets"
//            });
//
//            self.listenTo(v, "navigate:close", function() {
//                appLayout.signIn.transitionOut({
//                    transition: "sheetOutBottom"
//                });
//                v.off("navigate:close");
//            });
//
//            self.listenTo(APP, "app:signedin", function() {
//                appLayout.signIn.transitionOut({
//                    transition: "sheetOutBottom"
//                });
//            });
//
//            appLayout.signIn.transitionToView(v, {
//                transition: "sheetInBottom"
//            });
//        },
//
//        setOffline: function() {
//            this.model.select("offline");
//        },
//
//        setOnline: function() {
//            this.model.select("nav-hidden");
//        },
//
//        /**
//         * The app layout currently has only a few states:
//         *  - nav-hidden
//         *  - nav-active
//         *  - offline
//         */
//        toggleNav: function(e) {
//            // console.log(this.model.get("page"));
//            if (!this.nav.currentView && !this.overlays.isTransitioning) {
//                this.model.select("nav-active");
//            }
//        },
//
//        /**
//         * Call methods based on state of the global app.
//         *
//         * @param model     The state of the view.
//         */
//        navigate: function(model) {
//            var page = model.get("page");
//            switch (page) {
//                case "nav-hidden":
//                    this.closeMainSideNav();
//                    break;
//                case "nav-active":
//                    this.showMainSideNav();
//                    break;
//                case "offline":
//                    APP.router.navigate("offline");
//                    this.showOfflineView();
//                    break;
//            }
//        },
//
//        closeMainSideNav: function() {
//            this.nav.currentView.remove({
//                transition: "noneShort"
//            });
//            this.$el.removeClass('app-nav-active');
//            this.main.$el.off("touchend");
//        },
//
//        showMainSideNav: function() {
//            var self = this, NavView;
//            var navItem = self.model.get("navItem");
//
//            // Blur the soft keyboard if it's up!
//            document.activeElement.blur();
//
//            if (!navItem) {
//                navItem = APP.tablet() ?  "insights" : "equities";
//                self.model.set({
//                    navItem: navItem
//                });
//            }
//
//            var NavView = TransitionView.extend({
//                className: "site_nav",
//                template: APP.tablet() ? APP.templateManager.get("modal.main_nav_mobile") : APP.templateManager.get("modal.main_nav_mobile"),
//                parent: self,
//                model: self.model,
//                events: {
//                    "touchstart [data-href]": "preventDurchfall",
//                    "touchend [data-href]": "delegateNavigate"
//                },
//                modelEvents: {
//                    "change:navItem": "updateNavItem"
//                },
//                ui: {
//                    items: "[data-id]"
//                },
//                onRender: function() {
//                    this.updateNavItem();
//                    this.ui.items.hammer();
//                    // console.log('render navigation');
//                    self.triggerMethod("nav:open");
//                    this.undelegateEvents();
//                },
//                updateNavItem: function() {
//                    var navItem = this.model.get("navItem");
//                    var $item = this.$el.find("[data-id='" + navItem + "']");
//                    var $items = this.$el.find("[data-id]").not($item);
//                    $items.removeClass("nav__item--selected");
//                    $item.addClass("nav__item--selected");
//                },
//                onTransitionIn: function() {
//                    this.parent.triggerMethod("nav:ready");
//                    this.delegateEvents();
//                },
//                onClose: function() {
//                    var hammer = this.ui.items.data('hammer');
//    //                var hash = this.model.get("hash");
//
//                    if ("destroy" in hammer) {
//                        hammer.destroy();
//                    }
//
//    //                console.log(this.hash);
//                    if (this.hash) {
//                        APP.router.navigate(this.hash, {
//                            trigger: true
//                        });
//                        this.hash = false;
//                    }
//                    self.nav.currentView = null;
//                },
//                preventDurchfall: function(e) {
//                    e.stopPropagation();
//                    e.preventDefault();
//                },
//                delegateNavigate: function(e) {
//                    var target = e.currentTarget;
//                    var hash = target.dataset.href;
//                    this.model.set({
//                        navItem: target.dataset.id
//                    });
//                    this.hash = hash;
//                    this.model.set({
//                        hash: hash,
//                        previousHash: this.model.previous("hash")
//                    });
//                    this.model.select("nav-hidden");
//                    e.stopPropagation();
//                    e.preventDefault();
//                    this.undelegateEvents();
//                },
//                serializeData: function() {
//                    var data = this.model.toJSON();
//                    data.tablet = APP.tablet();
//                    return data;
//                }
//            });
//
//            var navView = new NavView();
//
//            self.nav.transitionToView(navView, {
//                transition: "noneShort"
//            });
//        },
//
//        onNavOpen: function() {
//            this.$el.addClass('app-nav-active');
//        },
//
//        onNavReady: function() {
//            var self = this;
//            this.main.$el.one("touchend", function(e) {
//                e.stopPropagation();
//                e.preventDefault();
//                self.model.select("nav-hidden");
//            });
//        },
//
//        /**
//         * Notifications
//         * -------------
//         *
//         * These are controlled by Forysth Barr in the CMS. The user will see a
//         * notification a maximum of five times. If they tap on the notification,
//         * it won't bug them the next time they launch/arrive at the starting view.
//         *
//         * On iPads, the notification shows on Insights.
//         * On iPhones, the notification shows on Equities.
//         *
//         */
//        showNotification: function (e) {
//            if (APP.notification.shouldShow() === true) {
//                this.appendNotification();
//                APP.notification.on("change", this.appendNotification);
//                APP.notification.setViewed(); //increment view counter
//            }
//        },
//
//        appendNotification: function () {
//
//            var self = this;
//
//            if (this.notificationView) {
//                this.notificationView.close();
//            }
//
//            this.notificationView = new APP.views.NotificationView({
//                model: APP.notification
//            });
//
//            this.notifications.show(this.notificationView);
//
//            setTimeout(function() { self.notificationView.close(); }, 7000);
//        },
//
//
//        /**
//         * There are issues with async loading of the template on certain
//         * iOS versions - so we just use a string at this point
//         */
//        showOfflineView: function() {
//            var offline = Handlebars.compile("<div class='app_offline table view'><div class='ui_vertical_center'><div class='wifi_icon'></div><h3 class='offline_message'>Please connect your device to the internet</h3></div></div>");
//            $("#boot_loader").hide();
//            this.$el.html(offline({}));
//        },
//
//        /**
//         * Touch event emulation
//         * ---------------------
//         *
//         * Same principle as things like FastClick. Measure the time from start of
//         * touch, track which element is under the touch co-ords, and synthesise
//         * a click event at ~30ms rather than 300ms.
//         *
//         * We also handle native list scrolling without highlighting current
//         * elements. This is a mindf**K of epic proportions.
//         */
//        touchStart: function(e) {
//            var _this = this;
//            var now = new Date();
//
//            var touch = e.originalEvent.touches[0];
//
//            this.start_y = e.originalEvent.touches[0].clientY;
//            this.current_y = this.start_y;
//
//            var target_el = this.getElement(e);
//
//            this.target_el = target_el;
//
//
//            if(_this.first_click_time === 0) {
//                _this.first_click_time = now;
//            } else {
//                _this.time_since_last_click = now - _this.first_click_time;
//                _this.first_click_time = now;
//            }
//
//            var activeEl = document.querySelectorAll(".tappable.active");
//
//            if (activeEl.length) {
//                for (var i = 0; i < activeEl.length; i++) {
//                    if (activeEl[i]) {
//                        activeEl[i].classList.remove("active");
//                    }
//                }
//            }
//
//            if (target_el) {
//
//                // This timeout prevents lists from flashing when the user scrolls.
//                this.tap_timeout = setTimeout(function() {
//
//                    if (_this.current_y === _this.start_y) {
//
//                        // If there's been more than one tap event within the timeframe...
//                        if (_this.time_since_last_click < _this.double_click_time && _this.prev_elem !== null) {
//                            target_el.classList.remove("active");
//
//                            if (target_el == _this.prev_elem) {
//                                // If the previous and target elements are the same, raise a click.
//                                _this.raiseClickEvent(target_el);
//                                target_el.classList.remove("active");
//                            } else {
//                                // Otherwise, remove the active class from the previous element.
//                                _this.prev_elem.classList.remove("active");
//                            }
//
//                        } else {
//
//                            _this.clearActiveTimeout = setTimeout(function() {
//                                var newEl = document.elementFromPoint(touch.pageX, touch.pageY);
//                                var firstTappableEl;
//                                var iterations = 0;
//
//                                while (newEl) {
//                                    if (newEl.className && typeof(newEl.className) === "string" && newEl.className.match(/tappable/) && iterations < 3) {
//                                        firstTappableEl = newEl;
//                                        newEl = false;
//                                    } else {
//                                        newEl = newEl.parentNode;
//                                    }
//                                    iterations++;
//                                }
//
//                                if (firstTappableEl !== target_el) {
//                                    target_el.classList.remove("active");
//                                }
//
//                                if (_this.prev_elem) {
//                                    _this.prev_elem.classList.remove("active");
//                                }
//
//                            }, 400);
//
//                            // Single tap, highlight the active element.
//                            target_el.classList.add("active");
//                        }
//
//                        _this.prev_elem = target_el;
//
//                    } else {
//                        if (_this.prev_elem) {
//                            _this.prev_elem.classList.remove("active");
//                        }
//                    }
//               }, 30);
//            }
//        },
//
//        /**
//         * Fire a fake click event on touchstart/touchend if needed.
//         */
//        raiseClickEvent: function(el) {
//            var evt = document.createEvent('MouseEvents');
//            evt.initMouseEvent(
//               'click',
//               true,     // Click events bubble
//               true,     // and they can be cancelled
//               document.defaultView,  // Use the default view
//               1,        // Just a single click
//               0,        // Don't bother with co-ordinates
//               0,
//               0,
//               0,
//               false,    // Don't apply any key modifiers
//               false,
//               false,
//               false,
//               0,        // 0 - left, 1 - middle, 2 - right
//               null);    // Click events don't have any targets other than the recipient of the click
//            evt.fake = true;
//            el.dispatchEvent(evt);
//        },
//
//        /**
//         * Remove active classes from elements when you're dragging around.
//         */
//        touchMove: function(e) {
//            var el = this.target_el;
//            this.current_y = e.originalEvent.touches[0].clientY;
//            if (el) {
//                el.classList.remove("active");
//            }
//        },
//
//        /**
//         * TouchEnd is our proxy for click. We synthesise a fast click event and
//         * fire it before the *real* browser click event would fire. This lets us
//         * bind to click if we need to.
//         */
//        touchEnd: function(e) {
//            var el;
//            var self = this;
//            var currentEl = this.getElement(e);
//            var touch = e.originalEvent.changedTouches[0];
//            var newEl = document.elementFromPoint(touch.pageX, touch.pageY);
//
//            // Check if there's been dragging motion, and don't do anything.
//            var userWasDragging = this.current_y !== this.start_y ? true : false;
//
//            // If the element doesn't match the touchstart element, don't
//            // do anything, since the user is dragging around.
//            if (newEl !== e.target || userWasDragging) {
//                e.preventDefault();
//                return;
//            }
//
//            // Otherwise pass through a fast synthesised click event.
//            if (currentEl) {
//                self.removeActiveState(currentEl);
//                self.raiseClickEvent(currentEl);
//                e.preventDefault();
//            }
//            e.preventDefault();
//            e.stopPropagation();
//        },
//
//        /**
//         * Remove the active state from an element after a given timeout
//         */
//        removeActiveState: function(el) {
//            var _delay = 150;
//            setTimeout(function() {
//                if(typeof(el) !== "undefined") {
//                    el.classList.remove("active");
//                    el.was_clicked = false;
//                }
//            }, _delay);
//        },
//
//        /**
//         * Deal with real vanilla click events and filter out fake ones.
//         */
//        handleClick: function(e) {
//            var link_href;
//            var clicked_el = this.getElement(e);
//
//            // Don't bother handling fake fast click events.
//            if (e.fake) {
//                return false;
//            }
//
//            if (clicked_el && "getAttribute" in clicked_el) {
//                link_href = clicked_el.getAttribute("href");
//            }
//
//            if (clicked_el) {
//                this.removeActiveState(clicked_el);
//                if (link_href) {
//                    window.location = link_href;
//                }
//                e.preventDefault();
//            }
//        },
//
//        /**
//         * Check if the element we're clicking matches the list of elements
//         * that can receive click events in our own little world here.
//         *
//         * @returns EventTarget
//         */
//        getElement: function(e) {
//            return e.currentTarget;
//        },
//
//
//        /**
//         * Fires up a childBrowser instance for child browser links.
//         *
//         * @param e     click event
//         * @returns {*} or false
//         */
//        handleChildBrowserClick: function(e) {
//
//            var el = e.currentTarget;
//            var childBrowser = this.isChildBrowserLink(el);
//
//            if (childBrowser) {
//
//                // var url = childBrowser.url || ;
//
//                this.removeActiveState(el);
//
//                options = childBrowser;
//
//    /*            if (childBrowser.url) {
//                    options = childBrowser;
//                } else {
//                    options = {
//                        title: currentEl.dataset.title,
//                        url: currentEl.dataset.url
//                    }
//                }*/
//
//
//                // Record Research ChildBrowser Research View
//                if (childBrowser.url.match("research-library")) {
//                    APP.trackEventWithCategory("Research", "PDF View", childBrowser.title + " | " +childBrowser.url);
//                }
//
//                return APP.trigger("childBrowser:show", options);
//            }
//            return false;
//        },
//
//
//        /**
//         * Check if the element should open a childbrowser instance
//         *
//         * @param el        A DOM element
//         * @returns {*}     Hash with URL and Title of child-browser item.
//         */
//        isChildBrowserLink: function(el) {
//            if (el.dataset) {
//                if (el.dataset["childbrowserUrl"]) {
//                    return {
//                        url: el.dataset["childbrowserUrl"],
//                        title: el.dataset["childbrowserTitle"] || "Forsyth Barr"
//                    };
//                }
//            }
//            return el.className.match(/(news_item)|(pdf_viewer)|(pdf_link)/) ? true : false;
//        }
    });
},{"./region.transition":11}],6:[function(require,module,exports){
var TransitionRegion = require("./region.transition");
var AnimationController = require("./animation");


module.exports = Marionette.LayoutView.extend({
    contentActiveClass: "ui_viewport--modal-active",
    className: "ui_modal active",
    contentViewTransition: "scaleOutModal",
    template: 'app/templates/layout.modal.nunj',
    regions: {
        main: {
            selector: "[data-modal-content]",
            regionType: TransitionRegion
        }
    },
    events: {
        // TODO: check that swapping touchend and click events really is the solution to modals closing themselves.
        "click .ui_modal--new": "isolate",
        "touchend .ui_modal--new": "doClose",
        "touchend [data-btn-close]": "doClose",
        "click [data-modal-content]": "isolate",
        "touchend [data-modal-content]": "isolate"
    },
    isolate: function(e) {
        e.stopPropagation();
    },
    initialize: function(options) {
        var self = this;
        _.extend(self, options);
    },
    doClose: function(e) {
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        self.main.currentView.remove({
            transition: self.contentViewTransition
        });
    },
    onClose: function() {
        vent.trigger("modal:close");
    },
    onShow: function() {
        var self = this;

        // By default, transitions use position absolute, but this does
        // funny things with modals, since they're display table cell.
        self.main.transitionToView(self.contentView, {
            transition: self.showTransition,
            relative: true
        });


        // Bind a listener to the close event of the modal's content.
        // This lets us automatically clean-up when the content view
        // has determined it should close.
        self.listenTo(self.main.currentView, "close", function() {
            this.$el.removeClass("active");

            self.remove({
                transition: "reallyQuickFade"
            });
        });

        vent.trigger("modal:show");
    },
    remove: function(options) {
        var self = this;
        var remove = function() {
            self.$el.remove();
            self.stopListening();
            self.close();
        };

        if (options && options.transition) {
            var transition = Transitions.getTransitionOutClass(options.transition);
            // console.log("remove: transition:", transition);
            var anim = AnimationController.create({
                view: this,
                context: this,
                animationClass: transition,
                shouldCloseView: true,
                shouldUsePositionAbsolute: false,
                callback: function(e) {
                    remove();
                    return this;
                }
            });

            AnimationController.run([anim]);

        } else {
            remove();
        }
    }
});



},{"./animation":3,"./region.transition":11}],7:[function(require,module,exports){
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
},{"./animation":3,"./region.transition":11}],8:[function(require,module,exports){
var TransitionRegion = require("./region.transition");
var AnimationController = require("./animation");
var Transitions = require("./ui.transitions");

/**
 * Returns the last member of an array
 * @param array
 * @returns {*}
 */
var getLast = function(array) {
    if ( array.length > 0 )
        return array[ array.length - 1 ];
    else
        return undefined;
};

/**
 * Push views on and off a 'stack' while persisting their state.
 */

module.exports = Marionette.View.extend({

    hasRootView: false,

    // Define options for transitioning views in and out
    defaults: {
        inTransitionClass: 'aSlideFadeInFromRight',
        outTransitionClass: 'aSlideFadeOutToRight',
        inTransitionPrevClass: "aSlideFadeInFromLeft",
        outTransitionPrevClass: "aSlideFadeOutToLeft",
        animationClass: 'ui_animated',
        className: 'ui_stack ui_scroll_content',
        itemClass: 'ui_stack_item view'
    },

    initialize: function(options) {
        this.views = [];
        options = options || {};
        this.options = _.extend(_.defaults({}, this.defaults), options);
    },

    setRootView: function(view, options) {
        this.hasRootView = true;
        var oldView = this.views[0] || null;
        this.views = [];
        this.views.push(view);
        var options = options || {};

        if (options.transition) {
            options.shouldCloseOldView = true;
            this.transitionViewIn(view, oldView, options);
        } else {
            // Only re-render the view if it's not visible.
            if (!view._isShown) {
                this.$el.empty();
                view.render();
                this.$el.append(view.$el);
            }
            view.trigger("show");
        }
        view.$el.addClass(this.options.itemClass);
    },

    render: function() {
        this.$el.addClass(this.options.className);
        this.isClosed = false;
        this.triggerMethod("before:render", this);
        this.triggerMethod("stack:before:render", this);
        this.bindUIElements();
        this.triggerMethod("render", this);
        this.triggerMethod("stack:rendered", this);
    },

    onRender: function () {
        // console.log('StackView: onRender', this.$el);
    },

    empty: function() {
        if (this.views.length > 0) {
            for(var i = 0; i < this.views.length; i++) {
                this.views[i].close();
            }
            this.$el.empty();
            this.views = [];
        }
    },

    // Pop the top-most view off of the stack.
    pop: function(options) {
        var self = this;
        var transition = false;
        var options = options || {};

        if (this.isTransitioning) {
            return false;
        }

        if (this.views.length > (this.hasRootView ? 1 : 0)) {
            var view = this.views.pop();
            var newView = getLast(this.views);
            if (options.transition || this.useDefaultTransitions) {
                this.transitionViewOut(view, newView, options);
            } else {
                newView.$el.removeClass("ui_stack_hidden");
                view.close();
            }
        }
    },

    // Push a new view onto the stack.
    // The itemClass will be auto-added to the parent element.
    push: function(view, options) {
        var self = this;
        var oldView = getLast(this.views);
        var transition = false;


        if (!this.views.length) {
            this.setRootView(view, options);
            return;
        }

        // Don't push the same view onto the stack twice, or push another view
        // if a transition is already underway.
        if (this.isTransitioning || oldView === view) {
            return false;
        }

        if (options) {
            transition = options.transition;
        }

        var hash = ""; //TODO: APP.State.get("hash");
        view.hash = hash;

        this.views.push(view);

        if (transition || this.useDefaultTransitions) {
            this.transitionViewIn(view, oldView, options);
        } else {
            if (oldView) {
                oldView.$el.addClass("ui_stack_hidden");
            }
            view.render();
            this.$el.append(view.$el);
            view.$el.addClass(self.options.itemClass);
        }
    },

    // Transition the new view in.
    // This is broken out as a method for convenient overriding of
    // the default transition behavior. If you only want to change the
    // animation use the trasition class options instead.
    transitionViewIn: function(view, oldView, options) {
        var self = this;
        var inTransition, outTransition;
        var transition = false;
        var shouldCloseOldView = false;
        var shouldPreventUserInteraction = false;
        var options = options || {};

        if (options.transition) {
            transition = options.transition;
        }

        if (options.shouldCloseOldView) {
            shouldCloseOldView = options.shouldCloseOldView;
        }

        if (typeof(options.shouldPreventUserInteraction) !== "undefined") {
            shouldPreventUserInteraction = options.shouldPreventUserInteraction;
        }

        this.trigger("before:transitionIn", this, view);

        if (transition) {
            inTransition = Transitions.getTransitionInClass(transition);
            outTransition = Transitions.getTransitionOutClass(transition);
        } else {
            inTransition = this.options.inTransitionClass;
            outTransition = this.options.outTransitionPrevClass;
        }

        var anim = AnimationController.create({
            view: view,
            context: this,
            animationClass: inTransition,
            shouldAppendView: true, // new view needs to be inserted into DOM.,
            shouldPreventUserInteraction: shouldPreventUserInteraction,
            callback: function(e) {
                // console.log("StackView: New View finished: ", +new Date());
                Marionette.triggerMethod.call(view, "transition:in");
                Marionette.triggerMethod.call(view, "show");
                vent.trigger("animation:interaction:allow");
                self.isTransitioning = false;
            }
        });


        if (oldView) {
            var oldViewAnim = AnimationController.create({
                view: oldView,
                context: this,
                animationClass: outTransition,
                shouldHideView: true,
                shouldCloseView: shouldCloseOldView,
                shouldPreventUserInteraction: shouldPreventUserInteraction,
                callback: function(e) {
                    Marionette.triggerMethod.call(oldView, "transition:out");
                }
            });

            this.trigger("before:transitionOut", this, view);

            if (!options.serialTransition) {
                AnimationController.run([oldViewAnim, anim]);
            } else {
                // one after the other...
                this.listenToOnce(oldView, "transition:out", function() {
                    //console.log("StackView: OLD VIEW FINISHED", +new Date());
                    AnimationController.run([anim]);
                });
                //console.log("StackView: Start Transition: Series", +new Date());
                AnimationController.run([oldViewAnim]);
            }

        } else {
            //console.log("StackView: Start Transition", +new Date());
            AnimationController.run([anim]);
        }

        self.isTransitioning = true;

    },

    // Trastition a view out.
    // This is broken out as a method for convenient overriding of
    // the default transition behavior. If you only want to change the
    // animation use the trasition class options instead.
    transitionViewOut: function(view, newView, options) {
        var self = this;
        var options = options || {};
        var deferRender = true;
        var transition = false;
        var shouldPreventUserInteraction = false;

        if (options.transition) {
            transition = options.transition;
        }

        if (transition) {
            inTransition = Transitions.getTransitionInClass(transition);
            outTransition = Transitions.getTransitionOutClass(transition);
        } else {
            inTransition = this.options.inTransitionPrevClass;
            outTransition = this.options.outTransitionClass;
        }

        if (typeof(options.shouldPreventUserInteraction) !== "undefined") {
            shouldPreventUserInteraction = options.shouldPreventUserInteraction;
        }

        this.trigger("before:transitionOut", this, view);

        Backbone.Marionette.triggerMethod.call(view, "before:transition:out");

        var newViewAnim;
        var anim = AnimationController.create({
            view: view,
            context: this,
            animationClass: outTransition,
            shouldCloseView: true,
            shouldPreventUserInteraction: shouldPreventUserInteraction,
            callback: function(e) {
                self.trigger("transitionOut", self, view);
                Marionette.triggerMethod.call(view, "transition:out");
                self.isTransitioning = false;
            }
        });

        if (view.hash) {
            vent.trigger('navigate:hash', view.hash);
        }

        if (newView) {
            //console.log("newView:: ", newView);
            newViewAnim = AnimationController.create({
                view: newView,
                context: this,
                shouldAppendView: false, // view is already in DOM!
                animationClass: inTransition,
                shouldPreventUserInteraction: shouldPreventUserInteraction,
                callback: function(e) {
                    Marionette.triggerMethod.call(newView, "transition:in");
                }
            });

            if (!options.serialTransition) {
                AnimationController.run([newViewAnim, anim]);
            } else {
                //console.log("SERIAL TRANSITION", +new Date());
                // one after the other...
                this.listenToOnce("transition:out", function() {
                    //console.log("OLD VIEW FINISHED", +new Date());
                    AnimationController.run([newViewAnim]);
                });

                AnimationController.run([anim]);
            }

        } else {
            AnimationController.run([anim]);
        }
        this.isTransitioning = true;
    },

    onBeforeClose: function() {
        var self = this;
        _.each(self.views, function(item) {
            // It's a bit low-level. But works. Hmm...
            item.close();
            item._isShown = false;
        });
    },

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
                    remove();
                    return this;
                }
            });

            AnimationController.run([anim]);
        } else {
            remove();
        }
    }
});
},{"./animation":3,"./region.transition":11,"./ui.transitions":15}],9:[function(require,module,exports){
var TransitionRegion = require("./region.transition");
var AnimationController = require("./animation");

module.exports = Marionette.LayoutView.extend({

    template: "app/templates/layout.tabs.nunj",

    className: "ui_tabview",

    regions: {
        title: {
            selector: ".ui_title_bar"
        },
        main: {
            regionType: TransitionRegion,
            selector: ".content"
        },
        sheet: {
            regionType: TransitionRegion,
            selector: ".sheet"
        },
        tabs: {
            regionType: TransitionRegion,
            selector: ".tabs"
        },
        overlays: {
            regionType: TransitionRegion,
            selector: ".overlays"
        }
    },

    initialize: function(options) {
        if (options.tabView) {
            this.tabView = options.tabView;
        }

        if (options.mainView) {
            this.mainView = options.mainView;
        }

        if (options.titleView) {
            this.titleView = options.titleView;
        }

        if (this.onInitialize) {
            this.onInitialize(options);
        }
    },

    onRender: function() {
        this.delegateEvents();

        if (this.tabView) {
            if (this.tabs.currentView !== this.tabView) { // re-rendering no more.
                this.tabs.show(this.tabView); // Re -rendering!!? :(
            }
        }

        if (this.mainView) {
            //console.log("render main view", this.mainView);
            if (this.main.currentView !== this.mainView) {
                this.main.show(this.mainView);
            }
        }

        if (this.titleView) {
            if (this.title.currentView !== this.titleView) {
                this.title.show(this.titleView);
            }
        }
    }
});
},{"./animation":3,"./region.transition":11}],10:[function(require,module,exports){
module.exports = Marionette.LayoutView.extend({
    template: "app/templates/title-with-content.nunj",
    regions: {
        content: "[data-content]",
        title: "[data-title]"
    }
});
},{}],11:[function(require,module,exports){
/**
 * Create a custom Morionette Region. Instead of simply replacing the
 * contents with a new view when calling show(), we add the new view
 * off-screen and transition the region to show the new view.
 *
 * When the transition is done the region is reset to it's original location.
 *
 */
module.exports = Marionette.Region.extend({

    transitionComplete: function(newView) {
        var self = this;
        self.isTransitioning = false;
        self.currentView = newView;
    },

    beforeTransition: function(view){
        var self = this;
    },

    // Very similar to show(), but uses css transition class between views
    transitionToView: function(newView, options) {

        this.ensureEl();

        var self = this;
        var oldView = this.currentView;
        var newViewCallBack = false;
        var deferRender = true;
        var type = "fade";
        var options = options || {};
        var shouldUsePositionAbsolute = true;
        var shouldPreventUserInteraction = false;

        if (self.isTransitioning || newView === oldView) {
            return false;
        }

        if (options.newViewCallBack){
            newViewCallBack = options.newViewCallBack;
        }

        if (typeof(options.shouldPreventUserInteraction) !== "undefined") {
            shouldPreventUserInteraction = options.shouldPreventUserInteraction;
        }

        if (options.relative) {
            shouldUsePositionAbsolute = false;
        }

        if (options.transition){
            type = options.transition;
        }

        if (!type) {
            type = "fade";
        }

        if (!oldView || oldView.isClosed) {
            this.close();
        }

        Marionette.triggerMethod.call(this, "before:transitionToView", oldView);

        var anim = AnimationController.create({
            view: newView,
            context: this,
            animationClass: Transitions.getTransitionInClass(type),
            shouldAppendView: true, // new view needs to be inserted into DOM.
            shouldUsePositionAbsolute: shouldUsePositionAbsolute,
            callback: function(e) {
                Marionette.triggerMethod.call(newView, "transition:in");
                Marionette.triggerMethod.call(newView, "show");
//                    Marionette.triggerMethod.call(APP.layoutManager.get("root").$el, "animation:interaction:allow");
                if (newViewCallBack) {
                    newViewCallBack();
                }
                self.transitionComplete(newView);
            }
        });

        if (oldView) {
            var oldViewAnim = AnimationController.create({
                view: oldView,
                context: this,
                animationClass: Transitions.getTransitionOutClass(type),
                shouldCloseView: true,
                shouldUsePositionAbsolute: true,
                shouldPreventUserInteraction: shouldPreventUserInteraction,
                callback: function(e) {
                    Marionette.triggerMethod.call(oldView, "transition:out");
                    Marionette.triggerMethod.call(oldView, "close");
                }
            });

            if (options.serialTransition) {
                AnimationController.run([oldViewAnim]);
                this.listenToOnce(oldView, "transition:out", function() {
                    self.beforeTransition.call(self, newView);
                    AnimationController.run([anim]);
                });
            } else {
                AnimationController.run([oldViewAnim, anim], function(){
                });
            }
            Marionette.triggerMethod.call(oldView, "before:transition:out");
        } else {
            AnimationController.run([anim], function(){
                self.beforeTransition.call(self, newView);
            });
        }

        Marionette.triggerMethod.call(newView, "before:transition");

        self.currentView = newView;
        this.isTransitioning = true;
    },

    transitionOut: function(options) {
        var self = this;
        var transition = options.transition || "fade";
        var shouldPreventUserInteraction = options.shouldPreventUserInteraction || false;
        var oldView = this.currentView;

        if (!oldView) {
            this.close();
            return;
        }

        var oldViewAnimation = AnimationController.create({
            view: oldView,
            context: this,
            animationClass: Transitions.getTransitionOutClass(transition),
            shouldCloseView: true,
            shouldUsePositionAbsolute: true,
            shouldPreventUserInteraction: shouldPreventUserInteraction,
            callback: function(e) {
                Marionette.triggerMethod.call(oldView, "transition:out");
                Marionette.triggerMethod.call(oldView, "close");
                Marionette.triggerMethod.call(self, "close");
                self.onExitingViewClose();
            }
        });


        AnimationController.run([oldViewAnimation], function(){
            self.beforeTransition.call(self, oldViewAnimation);
        });
        Marionette.triggerMethod.call(oldView, "before:transition:out");
    },

    onExitingViewClose: function() {
        var self = this;
        self.close();
        self.isTransitioning = false;
    }
});
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
/**
 * Generic touch carousel. Useful for things like an app guide or collection of images.
 * @param el
 * @returns {Carousel}
 * @constructor
 */
var Carousel = function (el) {
    this.el = el;

    this.v = {
        pages: el.querySelectorAll('.ui_carousel_item'),
        indicator: el.querySelectorAll('.ui_carousel_indicator')[0],
        scroll_region: el.querySelectorAll('.ui_carousel_list')[0],
        bullets: []
    };

    this.current_page = this.v.pages[0];
    this.current_index = 0;
    this.content_offset_x = 0;
    this.drag_threshold = this.el.offsetWidth/2;
    this.dragThresholdY = 5; //px
    this.velocity_threshold = 0.45;
    this.currentItemStartX = 0;
    this.deltaX = 0;
    this.total_pages = this.v.pages.length;
    this.touch_start_y = 0;
    this.bindEvents();

    this.v.scroll_region.setAttribute("style", "-webkit-transform: translate3d(0, 0, 0);");

    this.has_indicators = false;

    this.addIndicators();
    this.selectIndicator(0);

    return this;
};

Carousel.prototype.bindEvents = function() {
    if (this.total_pages < 2) return;

    this.el.removeEventListener("touchstart", this, false);
    this.el.removeEventListener("touchmove", this, false);
    this.el.removeEventListener("touchend", this, false);
    this.el.removeEventListener("click", this, false);

    this.el.addEventListener("touchstart", this, false);
    this.el.addEventListener("touchmove", this, false);
    this.el.addEventListener("touchend", this, false);
    this.el.addEventListener("click", this, false);
};

Carousel.prototype.handleEvent = function(event) {
    switch(event.type) {
        case "touchstart":
            this.onTouchStart(event);
            this.onClickEvent(event);
            break;
        case "touchmove":
            this.onTouchMove(event);
            break;
        case "touchend":
            this.onTouchEnd(event);
            break;
        case "click":
            this.onClickEvent(event);
            break;
    }
};

Carousel.prototype.onClickEvent = function(e) {
    if (e.target.className.match("ui_bullet")) {
        var index = e.target.getAttribute('data-index');
        if (index) {
            this.selectPage(+index); // cast it to number using the + operator to avoid NaN errors.
        }
    }
};

Carousel.prototype.onTouchStart = function(e) {
    this.has_transitioned = false;
    this.drag_distance = 0;
    this.start_time = new Date();
    this.touch_start_x = e.touches[0].clientX;
    this.touch_start_y = e.touches[0].clientY;
    this.content_offset_start_x = this.content_offset_x;
};

Carousel.prototype.onTouchMove = function(e) {
    var deltaX, time;

    this.latest_x = e.touches[0].clientX;

    if (this.has_transitioned) {

        return;
    }

    deltaX = this.latest_x - this.touch_start_x;
    time = new Date() - this.start_time;
    this.velocity = deltaX / time;
    this.deltaX = deltaX;


    if (!this.draggedPastEnd() && !this.draggedPastStart()) {

        if (deltaX > 0 && this.shouldTransition()) {
            this.shouldSnap = false;
            this.previousItem();
        } else if (deltaX < 0 && this.shouldTransition()) {
            this.shouldSnap = false;
            this.nextItem();
        } else {
            this.moveTo(-this.currentItemStartX + deltaX);
        }

    } else {
        this.moveTo(-this.currentItemStartX + (deltaX)/2);
        this.shouldSnap = true;
    }
};

Carousel.prototype.shouldTransition = function() {
    var velocity = this.velocity;
    ////console.log(velocity);
    if (Math.abs(velocity) > this.velocity_threshold) {
        return true;
    }

    if (Math.abs(this.deltaX) > this.drag_threshold) {
        return true;
    }

    return false;
};

Carousel.prototype.draggedPastStart = function() {
    ////console.log("past start?? :",  -this.currentItemStartX + this.deltaX);
    if (-this.currentItemStartX + this.deltaX > 0) {
        return true;
    }

    return false;
};

Carousel.prototype.draggedPastEnd = function() {
    var end = this.total_pages-1;
    var last = this.v.pages[end];

    if (this.current_index === end && last.offsetLeft > this.currentItemStartX + this.deltaX) {
        return true;
    }

    return false;
};

Carousel.prototype.onTouchEnd = function(e) {
    if (this.has_transitioned) return;
    this.animateTo(-this.currentItemStartX);
};

Carousel.prototype.moveTo = function(x) {
    var el = this.v.scroll_region;
    el.style.webkitTransform = "translate3d(" + x + "px, 0, 0)";
    el.style.webkitTransition = "";
};


Carousel.prototype.nextItem = function() {
    var p = this.current_index + 1;
    this.selectPage(p);
};

Carousel.prototype.previousItem = function() {
    var p = this.current_index - 1;
    this.selectPage(p);
};

Carousel.prototype.selectPage = function(num) {
    var len = this.v.pages.length;
    var new_left;
    var el;

    if (num < 0) {
        num = len-1;
    } else if (num > len -1 ) {
        num = 0;
    }

    el = this.v.pages[num];

    this.selectIndicator(num);
    new_left = el.offsetLeft;
    this.animateTo(-new_left);
    this.current_index = num;
    this.currentItemStartX = new_left;

    // Delegate an event, for the sake of it.
    var e = document.createEvent("Event");
    e.target = el;
    e.index = num;
    e.total = len-1;
    e.initEvent("UICarouselPageSelect", true, true);
    this.el.dispatchEvent(e);
};

Carousel.prototype.animateTo = function(newX) {
    var el = this.v.scroll_region;
    el.style.webkitTransform = "translate3d(" + newX + "px, 0, 0)";
    el.style.webkitTransition = "-webkit-transform 0.3s cubic-bezier(0.33,0.66,0.66,1.0)";
    this.has_transitioned = true;
};

Carousel.prototype.selectIndicator = function(num) {
    var bullets = this.v.bullets;

    for (i = 0; i < bullets.length; i ++) {
        if (typeof(bullets[i]) !== "undefined") {
            bullets[i].setAttribute('class', 'ui_bullet');
        }
    }

    if (typeof(bullets[num]) !== "undefined") {
        bullets[num].setAttribute('class', 'ui_bullet active');
    }
};

Carousel.prototype.addIndicators = function() {
    if (this.total_pages < 2) return;

    var _this = this;
    var i, bullet, class_name;
    var bullets = this.v.bullets;

    var bullet_container = this.v.indicator;
    var fragment = document.createDocumentFragment();

    bullet_container.innerHTML = "";

    if (bullets && bullets.length === 0) {

        for (i = 0; i < this.total_pages; i ++) {
            bullet = document.createElement('li');
            bullet_icon = document.createElement('i');
            class_name = "ui_bullet";
            bullet.setAttribute('class', class_name);
            bullet.setAttribute('data-index', i);
            bullet.appendChild(bullet_icon);
            fragment.appendChild( bullet );
            this.v.bullets.push(bullet);
        }

        bullet_container.appendChild(fragment);
        this.has_indicators = true;
    }
};


module.exports = Carousel;
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
/**
 * Define a hash of transitions. The inbound class gets applied to the
 * incoming newView, and outbound goes on the oldView as it is destroyed
 * by the region management.
 */
module.exports = {
    getTransitionInClass: function(type) {
        var transition = this.setup[type];
        if (!transition) console.log("Transitions: No transition with name " + type );
        return transition ? transition.inbound : "aFadeIn";
    },

    getTransitionOutClass: function(type) {
        var transition = this.setup[type];
        if (!transition) console.log("Transitions: No transition with name " + type );
        return transition ? transition.outbound : "aFadeOut";
    },
    setup: {
        fade: {
            inbound: "aFadeIn",
            outbound: "aFadeOut"
        },
        reallyQuickFade:{
            inbound: "aFadeInQuick",
            outbound: "aNoMotionQuick"
        },
        quickCrossFade:{
            inbound: "aFadeInQuick",
            outbound: "aFadeOutQuick"
        },
        slideFadeLeft: {
            inbound: "aSlideFadeInFromLeft",
            outbound: "aSlideFadeOutToRight"
        },
        slideFadeRight: {
            inbound: "aSlideFadeInFromRight",
            outbound: "aSlideFadeOutToLeft"
        },
        slideLeft: {
            inbound: "aSlideInFromLeft",
            outbound: "aSlideOutToRight"
        },
        slideRight: {
            inbound: "aSlideInFromRight",
            outbound: "aSlideOutToLeft"
        },
        slideUp: {
            inbound: "aSlideInFromBottom",
            outbound: "aSlideOutToTop"
        },
        slideDown: {
            inbound: "aSlideInFromTop",
            outbound: "aSlideOutToBottom"
        },
        sheetInBottom: {
            inbound: "aSlideOverEnterFromBottom",
            outbound: "aNoMotion"
        },
        sheetInTop: {
            inbound: "aSlideOverEnterFromTop",
            outbound: "aNoMotion"
        },
        sheetOutBottom:{
            inbound: "aNoMotionBehind",
            outbound: "aSlideOverExitToBottom"
        },
        sheetOutTop:{
            inbound: "aNoMotionBehind",
            outbound: "aSlideOverExitToTop"
        },
        sheetInRight:{
            inbound: "aSlideInFromRight",
            outbound: "aNoMotionBehind"
        },
        sheetInLeft:{
            inbound: "aSlideInFromLeft",
            outbound: "aNoMotionBehind"
        },
        sheetOutRight:{
            inbound: "aNoMotionBehind",
            outbound: "aSlideOutToRight"
        },
        sheetOutLeft:{
            inbound: "aNoMotionBehind",
            outbound: "aSlideOutToLeft"
        },
        flipDown: {
            inbound: "aFlipIn",
            outbound: "aFlipOut"
        },
        flipUp: {
            inbound: "aFlipOut",
            outbound: "aFlipIn"
        },
        rallyInRight: {
            inbound: "aFlipSlideFadeInRight",
            outbound: "aFlipSlideFadeOutLeft"
        },
        rallyInLeft: {
            inbound: "aFlipSlideFadeInLeft",
            outbound: "aFlipSlideFadeOutRight"
        },
        // Has double duration...
        scaleInLeft:{
            inbound: "aScaleInLeft",
            outbound: "aScaleOutRight"
        },
        // Has double duration...
        scaleInRight:{
            inbound: "aScaleInRight",
            outbound: "aScaleOutLeft"
        },
        scaleInModal: {
            inbound: "aScaleIn",
            outbound: "aNoMotion"
        },
        scaleOutModal: {
            inbound: "aNoMotion",
            outbound: "aScaleOut"
        },
        none: {
            inbound: "aNoMotion",
            outbound: "aNoMotion"
        },
        // Has double duration...
        noneLong: {
            inbound: "aNoMotionLong",
            outbound: "aNoMotionLong"
        },
        noneShort: {
            inbound: "aNoMotionShort",
            outbound: "aNoMotionShort"
        }
    }
};
},{}],16:[function(require,module,exports){
var Carousel = require("./ui.carousel");

module.exports = Marionette.ItemView.extend({

    template: "app/templates/carousel.nunj",

    initialize: function (options) {
        var skipLabel = this.firstShowGuide ? "Skip" : "Close";
        this.model = new Backbone.Model({skipLabel: skipLabel});
        this.firstShowGuide = false;
    },

    events: {
        "UICarouselPageSelect .ui_carousel" : "changeButtonText",
        "click [data-next-item]": "showNextItem"
    },

    triggers: {
        "click [data-close]": "navigate:back"
    },

    ui: {
        "carousel": ".ui_carousel"
    },

    showNextItem: function(e) {
        this.carousel.nextItem();
    },

    serializeData: function() {
        var data = this.model ? this.model.toJSON() : new Backbone.Model({}).toJSON({});
        data.back = this.back;
        return data;
    },

    onRender: function() {
        this.carousel = new Carousel(this.ui.carousel.get(0));
    },

    changeButtonText: function(e) {
        var isLastPage = (e.originalEvent.index === e.originalEvent.total);
        var closeButton = this.$el.find("[data-close]");
        var nextButton = this.$el.find("[data-next-item]");
        var btnText = this.model.get("skipLabel"); //"Skip";
        var btnTextDone = "Start using the app";

        // Changing button text
        if(isLastPage && closeButton.html() === btnText){
            closeButton.html(btnTextDone);
            closeButton.removeClass('button-tertiary').addClass('button-secondary');
            nextButton.css({'display':'none'});
        } else if(!isLastPage && closeButton.html() === btnTextDone) {
            closeButton.html(btnText);
            closeButton.removeClass('button-secondary').addClass('button-tertiary');
            nextButton.css({'display':'inline-block'});
        }
    }
});

},{"./ui.carousel":13}],17:[function(require,module,exports){
module.exports = Marionette.ItemView.extend({
    template: "app/templates/view.empty.nunj",
    tagName: "div",
    className: "ui_empty",
    initialize: function(options) {
        if (this.model) {
            this.model.set("message", options.emptyMessage);
        }
    }
});
},{}],18:[function(require,module,exports){
module.exports = Marionette.ItemView.extend({
    template: "app/templates/view.fetching.nunj",
    tagName: "div",
    className: "ui_empty ui_fetching",
    type: "fetching"
});
},{}],19:[function(require,module,exports){
var Browser = require("./browser");

module.exports = Marionette.ItemView.extend({
    tagName: "div",
    template: Browser.tablet() ? "app/templates/list-item.tablet.nunj" : "app/templates/list-item.mobile.nunj",
    serializeData: function () {
        var data = this.model.toJSON();
        return data;
    }
});

},{"./browser":4}],20:[function(require,module,exports){
var TransitionView = require("./view.transition");

module.exports =  TransitionView.extend({
    className: "block--modal block--padding",
    serializeData: function() {
        var data = {};
        data.state = APP.state;
        return data;
    }
});



},{"./view.transition":25}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
var TabItemView = require("./view.tab-item");

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
},{"./view.tab-item":22}],24:[function(require,module,exports){
var Browser = require("./browser");

module.exports = Marionette.ItemView.extend({
    template: Browser.tablet() ? "app/templates/view.title.tablet.nunj" : "app/templates/view.title.mobile.nunj"
});
},{"./browser":4}],25:[function(require,module,exports){
var AnimationController = require("./animation");
var Transitions = require("./ui.transitions");

module.exports = Marionette.ItemView.extend({

    // Like a render/show but animated...
    reveal: function(options) {

    },

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
},{"./animation":3,"./ui.transitions":15}],26:[function(require,module,exports){
var Hummingbird = require("../index.js");
window.Hummingbird = Hummingbird;


},{"../index.js":1}]},{},[26])