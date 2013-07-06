/* global jQuery */
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
                from.css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': 0, 'z-index': 10 });
                to.css( { 'display' : "block", 'position': "absolute", 'width': slider.width, height: slider.height, 'top': 0, 'left': slider.width, 'z-index': 20 });
                to.animate( { left: -slider.width }, "slow", "easeInOutBack", function() {
                    slider.animations.showHide(from, to);
                } );
            },
            slideLeft: function(from, to) {
                from.css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': 0, width: slider.width, height: slider.height, 'z-index' : 10 });
                to.css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': slider.width, width: slider.width, height: slider.height, 'z-index' : 20 });
                slider.wrap.animate({ scrollLeft: to.position().left }, 'slow', 'easeInOutExpo', function() {
                    slider.animations.showHide(from, to);
                });
            },
            slideUp: function(from, to) {
                from.css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': 0, width: slider.width, height: slider.height, 'z-index' : 10 });
                to.css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': slider.width, width: slider.width, height: slider.height, 'z-index' : 20 });
            },
            //slideAllLeft: function(from, to) {
                //Transition Strategy: Position everything next to each other, and scroll through all of them until the correct position is found.
            //},
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
                wrap: slides.wrapAll('<div class="slider-wrap" />').parent(),
                slidesTotal: slides.length,
                width: $(root).width(),
                height: $(root).height(),
                buttonLeft: $('<div><div class="button-inner"></div>').addClass('button button-left').appendTo(root),
                buttonRight: $('<div><div class="button-inner"></div>').addClass('button button-right').appendTo(root),
                nav: $('<ul />').addClass('nav-wrap').appendTo(root)
            }, slider);
            slider.root.addClass('slider').css( { 'position': "relative", 'overflow': "hidden", 'width': slider.width, 'height': slider.height } );
            //Extend children for timer if used
            if (slider.root.data("options").useProgressBar === true) {
                var timerWrap = $('<div />').addClass('timer timerWrap').prependTo(root);
                slider = $.extend( {
                    timerWrap: timerWrap,
                    timer: $('<div />').addClass('timer timerContent').appendTo(timerWrap)
                }, slider);
                slider.root.css( { 'height': slider.height + 5 });
            }
            slider.wrap.css( { 'position': "relative", 'overflow': "hidden", 'width': slider.width, 'height': slider.height } );
            slider.buttonLeft.click(function() {
                var from = slider.root.data("current");
                slider.rotate(from, slider.findIndex(from-1));
                if (slider.root.data("started") === false) {
                    slider.stop();
                }
            });
            slider.buttonRight.click(function() {
                var from = slider.root.data("current");
                slider.rotate(from, slider.findIndex(from+1));
                if (slider.root.data("started") === false) {
                    slider.stop();
                }
            });
            //Handle button
            if (slider.root.data("options").useButtons === "hover" || slider.root.data("options").useButtons === true) {
                slider.root.hover(function() { slider.showButton(); }, function() { slider.hideButton(); });
            }
            else if (slider.root.data("options").useButtons === "always") {
                slider.showButton();
            }
            slider.buildNavs();
            slider.rotate(0, 0);
            //Handle navs
        },
        rotate: function(from, to) {
            //hide previous
            //show current
            window.clearTimeout(slider.root.data("timer"));
            slider.root.data("current",to);
            //Apply animations
            var data = $(slider.slides[to]).data();
            var transition = (data.transition === undefined)?slider.root.data("options").defaultTransition:data.transition;
            var timing = (data.timing === undefined)?slider.root.data("options").defaultTiming:data.timing;
            slider.animations[transition]($(slider.slides[from]), $(slider.slides[to]));
            from = to;
            to = slider.findIndex(to + 1);
            if (slider.root.data("options").useProgressBar === true) {
                slider.root.data("progressTiming", timing/1000);
                slider.root.data("timer", window.setTimeout(function() {
                    slider.progress(from, to, 0); }, slider.root.data("progressTiming") ));
            }
            else {
                slider.root.data("timer", window.setTimeout(function() {
                    slider.rotate(from, to); }, timing ));
            }
        },
        progress: function(from, to, progress) {
            slider.timer.css( { width: (progress + "%") } );
            if (100 === Math.floor(progress)) {
                slider.rotate(from, to);
            }
            else {
                window.clearTimeout(slider.root.data("timer"));
                slider.root.data("timer", window.setTimeout(function() {
                    slider.progress(from, to, progress + 0.1); }, slider.root.data("progressTiming") ));
            }
        },
        findIndex: function(cursor) {
            if (cursor === -1) {
                cursor = slider.slidesTotal - 1;
            }
            return (cursor % slider.slidesTotal);
        },
        addAnimation: function(funct) {
            slider.animations = $.extend(funct, slider.animations);
        },
        showButton: function() {
            slider.buttonLeft.show();
            slider.buttonRight.show();
            //Must check show button is enabled
        },
        hideButton: function() {
            slider.buttonLeft.hide();
            slider.buttonRight.hide();
        },
        buildNavs: function() {
            if (slider.root.data("options").useNavs === true) {
                $.each(slider.slides, function(key) {
                    $('<li />').addClass('nav nav-'+ (key+1)).appendTo(slider.nav).html(key+1).click(function() {
                        slider.rotate(slider.root.data("current"), key);
                    });
                });
            }
            if (slider.root.data("options").useStartStop === true) {
                slider.root.data("startstop", $('<li />').addClass('nav nav-startstop').appendTo(slider.nav).html("stop").click(function() {
                    slider.startStop();
                }));
            }
        },
        startStop: function() {
            if (slider.root.data("started") === true || slider.root.data("started") === undefined) {
                slider.stop();
            }
            else {
                slider.start();
            }
        },
        stop: function() {
            window.clearTimeout(slider.root.data("timer"));
            slider.root.data("started", false);
            if (slider.root.data("startstop") !== undefined) {
                slider.root.data("startstop").html("start");
            }
        },
        start: function() {
            slider.root.data("started", true);
            slider.rotate(slider.root.data("current"), slider.findIndex(slider.root.data("current") + 1));
            if (slider.root.data("startstop") !== undefined) {
                slider.root.data("startstop").html("stop");
            }
        }
    };
    $.fn.dataslide = function(options) {
        options = $.extend( {
            useTitle: true,
            useButtons: "hover", //options "hover", "always", true, false
            useNavs: false,
            useStartStop: false,
            useProgressBar: false,
            defaultTransition: "none",
            defaultTiming: 5000,
            autoPlay: true, //not used
            loop: true, //not used
            rememberLocation: false, //not used
            hoverPause: false,
            extraAnimations: false
        }, options);
        this.data("options", options);
        if (options.extraAnimations !== false) {
            slider.addAnimation(options.extraAnimations);
        }
        $(this).children().css( { 'display': "none" });
        slider.init(this);
    };
})(jQuery);