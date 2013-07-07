/* global jQuery */
;(function( $ ) {
    "use strict";
    var Dataslider = function(el, opts) {
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
                    from.removeClass("current").removeAttr("style").css( { display: "none"} );
                    to.addClass("current").removeAttr("style").css( { display: "block", width: slider.width,
                    height: slider.height, position: "relative" } );
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
                    to.fadeIn(2000, function() {
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
                slides.addClass("slide-card").css( { 'display': "none" });
                slider.wrap.addClass('slider').css( { 'position': "relative", 'overflow': "hidden", 'width': slider.width, 'height': slider.height } );
                //Extend children for timer if used
                if (slider.root.data("options").useProgressBar === true) {
                    var timerWrap = $('<div />').addClass('timer timer-wrap').prependTo(root);
                    slider = $.extend( {
                        timerWrap: timerWrap,
                        timer: $('<div />').addClass('timer timer-progress').appendTo(timerWrap)
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
                slider.root.hover(function() {
                    if (slider.root.data("options").useButtons === "hover" || slider.root.data("options").useButtons === true) {
                        slider.showButton();
                    }
                    if (slider.root.data("options").hoverPause === true) {
                        slider.stop();
                    }
                }, function() {
                    if (slider.root.data("options").useButtons === "hover" || slider.root.data("options").useButtons === true) {
                        slider.hideButton();
                    }
                    if (slider.root.data("options").hoverPause === true && (slider.root.data("stopped") === undefined || slider.root.data("stopped") === false)) {
                        slider.start();
                    }
                });
                //Handle button
                if (slider.root.data("options").useButtons === "always") {
                    slider.showButton();
                }
                slider.buildNavs();
                slider.buildThumbs();
                slider.rotate(0, 0);
                if(slider.root.data("options").autoPlay === false) {
                    slider.stop(true);
                }
                //Handle navs
            },
            rotate: function(from, to) {
                //hide previous
                //show current
                window.clearTimeout(slider.root.data("timer"));
                slider.root.data("current",to);
                var data = $(slider.slides[to]).data();
                var transition = (data.transition === undefined)?slider.root.data("options").defaultTransition:data.transition;
                var timing = (data.timing === undefined)?slider.root.data("options").defaultTiming:data.timing;
                var navs = slider.nav.children();
                $(navs[from]).removeClass("nav-current");
                $(navs[to]).addClass("nav-current");
                if (slider.root.data("options").useThumbnails === true) {
                    slider.rotateThumb(to);
                }
                if (from !== to || slider.root.data("progressTiming") === undefined) {
                    slider.animations[transition]($(slider.slides[from]), $(slider.slides[to]));
                    from = to;
                }
                to = slider.findIndex(to + 1);
                slider.root.data("progressTiming", timing/1000);
                if (slider.root.data("started") === undefined || slider.root.data("started") === true) {
                    slider.root.data("timer", window.setTimeout(function() {
                        slider.progress(from, to, 0); }, slider.root.data("progressTiming") ));
                }
                else {
                    //reset progress
                    slider.root.data("progress", 0);
                    if (slider.root.data("options").useProgressBar === true) {
                        slider.timer.css( { width: "0%" } );
                    }
                }
                //else {
                //    slider.root.data("timer", window.setTimeout(function() {
                //        slider.rotate(from, to); }, timing ));
                //}
            },
            progress: function(from, to, progress) {
                slider.root.data("progress", progress);
                if (slider.root.data("options").useProgressBar === true) {
                    slider.timer.css( { width: (progress + "%") } );
                }
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
            buildThumbs: function() {
                var thumbLocation = slider.root.data("options").useThumbnails;
                var thumbsWrap = $("<div />").addClass("thumbs-wrap").appendTo(slider.root);
                var thumbsWidth = 0;
                var thumbsHeight = 0;
                if (thumbLocation === true) {
                    thumbLocation = "bottom";
                }
                if (thumbLocation !== false) {
                    slider = $.extend( {
                        thumbsWrap: thumbsWrap,
                        thumbs: $('<ul />').addClass('thumbs').appendTo(thumbsWrap)
                    }, slider);
                    $.each(slider.slides, function(key, value) {
                        var imgs = '';
                        if ($(value).is("img") === true) {
                            imgs = $(value);
                        }
                        else {
                            imgs = $(value).find("img");
                        }
                        var html = '<img class="thumb-data" src ="';
                        if (imgs.data("thumb") !== undefined && imgs.data("thumb") !== null) {
                            html += imgs.data("thumb") + '" />';
                        }
                        else if (imgs !== undefined && imgs.attr("src") !== "null" && imgs.attr("src") !== undefined) {
                            html += imgs.attr("src") + '" />';
                        }
                        else {
                            html = '<div class="thumb-data">' + (key + 1) + '</div>';
                        }
                        var thumb = $('<li />').addClass('thumb thumb-'+ (key+1)).appendTo(slider.thumbs).html(html).click(function() {
                            slider.rotate(slider.root.data("current"), key);
                        });
                        thumbsWidth += thumb.outerWidth(true);
                        thumbsHeight += thumb.outerHeight(true);
                    });
                    //For top and bottom
                    slider.root.css( { height: slider.root.height() + slider.thumbs.children().height() });
                    slider.thumbs.css( { width: thumbsWidth });
                    //For left and right
                }
            },
            rotateThumb: function(to) {
                var thumbs = slider.thumbs.children("li");
                var toIndex = 0;
                thumbs.each(function( key, value ) {
                    $(value).removeClass("thumb-current");
                    if ($(value).hasClass("thumb-" + (to + 1))) {
                        toIndex = key;
                        $(value).addClass("thumb-current");
                    }
                });
                slider.thumbsWrap.animate({ scrollLeft: $(thumbs[toIndex]).position().left }, '500', 'swing', function() {
                    for (var i = 0; i < toIndex; i++) {
                        $(thumbs[i]).detach().appendTo(slider.thumbs);
                    }
                    //slider.thumbsWrap.animate({ scrollLeft:0 });
                    slider.thumbsWrap.scrollLeft(0);
                });
                //Determine if circular or not
            },
            startStop: function() {
                if (slider.root.data("stopped") === undefined || slider.root.data("stopped") === false) {
                    slider.stop(true);
                }
                else {
                    slider.start(true);
                }
            },
            stop: function(startstop) {
                startstop = (startstop === undefined)?false:startstop;
                window.clearTimeout(slider.root.data("timer"));
                slider.root.data("started", false);
                if (slider.root.data("startstop") !== undefined && startstop === true) {
                    slider.root.data("stopped", true);
                    slider.root.data("startstop").html("start");
                }
            },
            start: function(startstop) {
                startstop = (startstop === undefined)?false:startstop;
                slider.root.data("started", true);
                slider.progress(slider.root.data("current"), slider.findIndex(slider.root.data("current") + 1), slider.root.data("progress"));
                if (slider.root.data("startstop") !== undefined && startstop === true) {
                    slider.root.data("stopped", false);
                    slider.root.data("startstop").html("stop");
                }
            }
        };
        el.data("options", opts).addClass("slider-root");
        if (opts.extraAnimations !== false) {
            slider.addAnimation(opts.extraAnimations);
        }
        slider.init(el);

    };
    $.fn.dataslide = function(options) {
        options = $.extend( {
            useTitle: true,
            useButtons: "hover", //options "hover", "always", true, false
            useNavs: true,
            useStartStop: true,
            useProgressBar: true,
            useThumbnails: true, //options: "top", "left", "right", "bottom", true, false
            defaultTransition: "blend",
            defaultTiming: 5000,
            autoPlay: true,
            loop: false, //not currently implemented
            rememberLocation: false, //not currently implemented
            hoverPause: true,
            extraAnimations: false
        }, options);
        this.each(function () {
            new Dataslider($(this), options);
        });
    };
})(jQuery);