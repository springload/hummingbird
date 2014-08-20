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


    touch: function() {
        return ("ontouchstart" in window);
    },

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

