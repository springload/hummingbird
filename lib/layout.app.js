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