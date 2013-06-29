;(function( $ ) {
    "use strict";
    var slider = {
        //Set Animation effects variables
        animations: {
            fade: function(from, to) {
                from.fadeOut('slow', function() {
                    from.removeClass("current");
                    to.fadeIn('slow');
                    to.addClass("current");
                });
            },
            showHide: function(from, to) {
                //Transition Strategy: Immediately hide current slide and show the new slide
                from.removeClass("current").removeAttr("style").css( { 'display': "none"} );
                to.addClass("current").removeAttr("style").css( { 'display': "block" } );
            },
            bounce: function(from, to) {
                //Transition Strategy
                console.log('processing slide');
                from.css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': 0, 'z-index': 10 });
                to.css( { 'display' : "block", 'position': "absolute", 'width': slider.width, height: slider.height, 'top': 0, 'left': slider.width, 'z-index': 20 });
                to.animate( { left: -slider.width }, "slow", "easeInOutBack", function() {
                    slider.animations.showHide(from, to);
                } );
            },
            slideLeft: function(from, to) {
                from.css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': 0, width: slider.width, height: slider.height, 'z-index' : 10 });
                to.css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': slider.width, width: slider.width, height: slider.height, 'z-index' : 20 });
                slider.root.animate({ scrollLeft: to.position().left }, 'slow', 'easeInOutExpo', function() {
                    slider.animations.showHide(from, to);
                });
            },
            slideUp: function(from, to) {
                from.css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': 0, width: slider.width, height: slider.height, 'z-index' : 10 });
                to.css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': slider.width, width: slider.width, height: slider.height, 'z-index' : 20 });
            },
            slideAllLeft: function(from, to) {
                //Transition Strategy: Position everything next to each other, and scroll through all of them until the correct position is found.
            },
            blend: function(from, to) {
                //Transition Strategy: Set the new slide to higher z-index and slowly increase its opacity to 100% so it filled up the underneath div.
                from.css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': 0, width: slider.width, height: slider.height, 'z-index' : 10 });
                to.css( { 'position': "absolute", 'top': 0, 'left': 0, width: slider.width, height: slider.height, 'z-index' : 20 });
                to.fadeIn('slow', function() {
                    slider.animations.showHide(from, to);
                });
            },
            none: function(from, to) {
                //Defaulted to show and hide
                slider.animations.showHide(from, to);
            }
        },
        //Functions
        init: function(root) {
            //Count all childrens
            var slides = $(root).children();
            slider = $.extend( {
                root: root,
                slides: slides,
                slidesTotal: slides.length,
                width: $(root).width(),
                height: $(root).height()
            }, slider);
            slider.root.css( { 'position': "relative", 'overflow': "hidden", 'width': slider.width, 'height': slider.height } );
            slider.rotate(0, 0);

        },
        rotate: function(from, to) {
            //hide previous
            //show current
            slider.root.data("current",to);
            //Apply animations
            var data = $(slider.slides[to]).data();
            var transition = (data.transition === undefined)? $.data(root, "defaultTransition"):data.transition;
            slider.animations[transition]($(slider.slides[from]), $(slider.slides[to]));
            from = to;
            to = slider.findIndex(to + 1);
            data = $(slider.slides[to]).data();
            //if (loop || cursor !== 0) {
            slider.root.data("timer", window.setTimeout(function() { slider.rotate(from, to) }, data.timing ));
            //}
        },
        findIndex: function(cursor) {
            if (cursor === -1) cursor = slider.slidesTotal - 1;
            return (cursor % slider.slidesTotal);
        },
        addAnimation: function(funct) {
            slider.animations = $.extend(funct, slider.animations);
        }
    }
    $.fn.dataslide = function(options) {
        var options = $.extend( {
            useTitle: true,
            useButtons: true,
            defaultTransition: "none",
            autoPlay: true,
            loop: true,
            rememberLocation: false
        }, options);
        this.data("options", options);
        $(this).children().css( { 'display': "none" });
        slider.init(this);
    };
})(jQuery);