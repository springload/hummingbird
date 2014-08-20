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