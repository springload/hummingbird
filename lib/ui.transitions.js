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