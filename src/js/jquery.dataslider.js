/* global jQuery */
;(function( $ ) {
    "use strict";
    var Dataslider = function(el, opts) {
        var slider = {
            //Set Animation effects variables
            animations: {
                /* basic JS transformation */
                fade: function(object,from, to) {
                    $(object[from]).fadeOut('slow', function() {
                        $(object[from]).removeClass("current");
                        $(object[to]).fadeIn('slow');
                        $(object[to]).addClass("current");
                    });
                },
                showHide: function(object, from, to) {
                    //Transition Strategy: Immediately hide current slide and show the new slide
                    slider.wrap.scrollLeft(0);
                    $(object[from]).removeClass("current").removeAttr("style").css( { display: "none"} );
                    $(object[to]).addClass("current").removeAttr("style").css( { display: "block", width: slider.wrap.width(),
                    height: slider.wrap.height(), position: "relative" } );
                },
                bounce: function(object, from, to) {
                    //Transition Strategy
                    $(object[from]).css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': 0, 'z-index': 10 });
                    $(object[to]).css( { 'display' : "block", 'position': "absolute", 'width': slider.wrap.width(), height: slider.wrap.height(), 'top': 0, 'left': slider.wrap.width(), 'z-index': 20 });
                    $(object[to]).animate( { left: -slider.wrap.width() }, "slow", "easeInOutBack", function() {
                        slider.animations.showHide(object, from, to);
                    } );
                },
                slideLeft: function(object, from, to, redirect) {
                    redirect = (redirect === undefined)?false:redirect;
                    //do left slide only if to > from, or to = 0 if from is max
                    if (redirect === true || to >= from || (to === 0 && from === (slider.slides.length - 1))) {
                        $(object[from]).css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': 0, width: slider.wrap.width(), height: slider.wrap.height(), 'z-index' : 10 });
                        $(object[to]).css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': slider.wrap.width(), width: slider.wrap.width(), height: slider.wrap.height(), 'z-index' : 20 });
                        slider.wrap.animate({ scrollLeft: slider.wrap.width() }, 'slow', 'swing', function() {
                            slider.animations.showHide(object, from, to);
                        });
                    }
                    else {
                        slider.animations.slideRight(object, from, to, true);
                    }
                    //otherwise, do right slide
                },
                slideRight: function(object, from, to, redirect) {
                    redirect = (redirect === undefined)?false:redirect;
                    //do left slide only if to > from, or to = 0 if from is max
                    if (redirect === true || to >= from || (to === 0 && from === (slider.slides.length - 1))) {
                        $(object[from]).css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': slider.wrap.width(), width: slider.wrap.width(), height: slider.wrap.height(), 'z-index' : 10 });
                        slider.wrap.scrollLeft(slider.wrap.width());
                        $(object[to]).css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': 0, width: slider.wrap.width(), height: slider.wrap.height(), 'z-index' : 20 });
                        slider.wrap.animate({ scrollLeft: 0 }, 'slow', 'swing', function() {
                            slider.animations.showHide(object, from, to);
                        });
                    }
                    else {
                        slider.animations.slideLeft(object, from, to, true);
                    }
                    //otherwise, do right slide
                },
                slideUp: function(object, from, to) {
                    $(object[from]).css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': 0, width: slider.wrap.width(), height: slider.wrap.height(), 'z-index' : 10 });
                    $(object[to]).css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': slider.wrap.width(), width: slider.wrap.width(), height: slider.wrap.height(), 'z-index' : 20 });
                },
                //slideAllLeft: function(from, to) {
                    //Transition Strategy: Position everything next to each other, and scroll through all of them until the correct position is found.
                //},
                blend: function(object, from, to) {
                    //Transition Strategy: Set the new slide to higher z-index and slowly increase its opacity to 100% so it filled up the underneath div.
                    $(object[from]).css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': 0, width: slider.wrap.width(), height: slider.wrap.height(), 'z-index' : 10 });
                    $(object[to]).css( { 'position': "absolute", 'top': 0, 'left': 0, width: slider.wrap.width(), height: slider.wrap.height(), 'z-index' : 20 });
                    $(object[to]).fadeIn(2000, function() {
                        slider.animations.showHide(object, from, to);
                    });
                },
                none: function(object, from, to) {
                    //Defaulted to show and hide
                    slider.animations.showHide(object, from, to);
                },
                //CSS 3 Transformation
                cssRotate: function(object, from, to) {
                    $(object[from]).css( { '-webkit-animation': "rotate360 1s 16 ease",
                        '-moz-animation': "rotate360 1s 16 ease",
                        '-o-animation': "rotate360 1s 16 ease",
                        'animation': "rotate360 is 16 ease" })
                        .fadeOut('slow', function() {
                            $(object[from]).removeClass("current");
                            $(object[to]).css( { '-webkit-animation': "rotate360 1s 16 ease",
                                '-moz-animation': "rotate360 1s 16 ease",
                                '-o-animation': "rotate360 1s 16 ease",
                                'animation': "rotate360 is 16 ease" }).fadeIn('slow', function() {
                                    $(object[to]).addClass("current");
                                    slider.animations.showHide(object, from, to);
                                })
                        });
                },
                cssZoom: function(object, from, to) {
                    $(object[from]).css( { '-webkit-animation': "zoomInPhoto 1s 16 ease",
                        '-moz-animation': "zoomInPhoto 1s 16 ease",
                        '-o-animation': "zoomInPhoto 1s 16 ease",
                        'animation': "zoomInPhoto is 16 ease" })
                        .fadeOut('slow', function() {
                            $(object[from]).removeClass("current");
                            $(object[to]).css( { '-webkit-animation': "zoomInPhoto 1s 16 ease",
                                '-moz-animation': "zoomInPhoto 1s 16 ease",
                                '-o-animation': "zoomInPhoto 1s 16 ease",
                                'animation': "zoomInPhoto is 16 ease" }).fadeIn('slow', function() {
                                    $(object[to]).addClass("current");
                                    slider.animations.showHide(object, from, to);
                                })
                        });
                },
                cssFade: function(object, from, to) {
                    $(object[from]).css( {
                        'display' : "block", 'position': "absolute", 'top': 0, 'left': 0, width: slider.wrap.width(), height: slider.wrap.height(), 'z-index' : 20,
                        '-webkit-animation': "fadeOut 2s 1 ease",
                        '-moz-animation': "fadeOut 2s 1 ease",
                        '-o-animation': "fadeOut 2s 1 ease",
                        'animation': "fadeOut 2s 1 ease"
                    });
                    $(object[to]).css( { 'display' : "block", 'position': "absolute", 'top': 0, 'left': 0, width: slider.wrap.width(), height: slider.wrap.height(), 'z-index' : 20 });
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
                    buttonLeft: $('<div><div class="button-inner"></div>').addClass('button button-left').appendTo(root),
                    buttonRight: $('<div><div class="button-inner"></div>').addClass('button button-right').appendTo(root),
                    nav: $('<ul />').addClass('nav-wrap').appendTo(root)
                }, slider);
                slides.addClass("slide-card").css( { 'display': "none" });
                slider.buildThumbs();
                if (slider.root.data("options").useProgressBar === true) {
                    var timerWrap = $('<div />').addClass('timer timer-wrap').prependTo(root);
                    slider = $.extend( {
                        timerWrap: timerWrap,
                        timer: $('<div />').addClass('timer timer-progress').appendTo(timerWrap)
                    }, slider);
                    slider.root.css( { 'height': slider.root.height() + slider.timerWrap.outerHeight(true) });
                }
                slider.resize();
                slider.buttonLeft.click(function() {
                    slider.prev();
                });
                slider.buttonRight.click(function() {
                    slider.next();
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
                if (slider.root.data("options").useKeyboard === true) {
                    slider.listenKeyboard();
                }
                slider.buildNavs();
                slider.rotate(0, 0);
                if(slider.root.data("options").autoPlay === false) {
                    slider.stop(true);
                }
                $(window).resize(function() {
                    slider.resize();
                });
            },
            rotate: function(from, to) {
                window.clearTimeout(slider.root.data("timer"));
                slider.root.data("current",to);
                var data = $(slider.slides[to]).data();
                var transition = (data.transition === undefined)?slider.root.data("options").defaultTransition:data.transition;
                var timing = (data.timing === undefined)?slider.root.data("options").defaultTiming:data.timing;
                var navs = slider.nav.children();
                $(navs[from]).removeClass("nav-current");
                $(navs[to]).addClass("nav-current");
                if (slider.root.data("options").useThumbnails !== false) {
                    slider.rotateThumb(to);
                }
                if (from !== to || slider.root.data("progressTiming") === undefined) {
                    slider.animations[transition](slider.slides, from, to);
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
            },
            prev: function() {
                var from = slider.root.data("current");
                slider.rotate(from, slider.findIndex(from-1));
                if (slider.root.data("started") === false) {
                    slider.stop();
                }
            },
            next: function() {
                var from = slider.root.data("current");
                slider.rotate(from, slider.findIndex(from+1));
                if (slider.root.data("started") === false) {
                    slider.stop();
                }
            },
            progress: function(from, to, progress, forced) {
                progress = (progress === undefined)?0:progress;
                forced = (forced === undefined)?false:forced;
                slider.root.data("progress", progress);
                if (slider.root.data("options").useProgressBar === true) {
                    slider.timer.css( { width: (progress + "%") } );
                }
                if (100 === Math.floor(progress)) {
                    if (slider.root.data("options").loop === false && from === (slider.slides.length - 1) && forced === false) {
                        slider.stop(true);
                    }
                    else {
                        slider.rotate(from, to);
                    }
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
                if (slider.root.data("options").centerButtons === true) {
                    var top = slider.wrap.outerHeight()/2;
                    slider.buttonLeft.css( { top: top - (slider.buttonLeft.outerHeight()/2) } );
                    slider.buttonRight.css( { top: top - (slider.buttonRight.outerHeight()/2) } );
                }
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
                var thumbsWrap = "";
                if (thumbLocation === true) {
                    thumbLocation = "bottom";
                }
                if (thumbLocation !== false) {
                    if (thumbLocation === "bottom" || thumbLocation === "right") {
                        thumbsWrap = $("<div />").addClass("thumbs-wrap").appendTo(slider.root);
                    }
                    else {
                        thumbsWrap = $("<div />").addClass("thumbs-wrap").prependTo(slider.root);
                    }
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
                        $('<li />').addClass('thumb thumb-'+ (key+1)).appendTo(slider.thumbs).html(html).click(function() {
                            slider.rotate(slider.root.data("current"), key);
                        });
                    });
                }
            },
            rotateThumb: function(to) {
                var thumbs = slider.thumbs.children("li");
                var toIndex = 0;
                var animateOptions = { };
                 thumbs.each(function( key, value ) {
                    $(value).removeClass("thumb-current");
                    if ($(value).hasClass("thumb-" + (to + 1))) {
                        toIndex = key;
                        $(value).addClass("thumb-current");
                    }
                });
                if ($.inArray(slider.root.data("options").useThumbnails, [ "top", "bottom" ]) !== -1) {
                    animateOptions = { scrollLeft: $(thumbs[toIndex]).position().left };
                }
                else {
                    animateOptions = { scrollTop: $(thumbs[toIndex]).position().top };
                }
                //If Circular
                slider.thumbsWrap.animate(animateOptions, '500', 'swing', function() {
                    if (slider.root.data("options").circularThumbnails === true) {
                        for (var i = 0; i < toIndex; i++) {
                            $(thumbs[i]).detach().appendTo(slider.thumbs);
                        }
                        if ($.inArray(slider.root.data("options").useThumbnails, [ "top", "bottom" ]) !== -1) {
                            slider.thumbsWrap.scrollLeft(0);
                        }
                        else {
                            slider.thumbsWrap.scrollTop(0);
                        }
                    }
                });
                //If Not Circular
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
                slider.progress(slider.root.data("current"), slider.findIndex(slider.root.data("current") + 1), slider.root.data("progress"), true);
                if (slider.root.data("startstop") !== undefined && startstop === true) {
                    slider.root.data("stopped", false);
                    slider.root.data("startstop").html("stop");
                }
            },
            resize: function() {
                var parentWidth = slider.root.parent().width();
                var thumbLocation = slider.root.data("options").useThumbnails;
                var thumbs = false;
                var width = 0;
                var height = 0;
                if (thumbLocation !== false) {
                    thumbs = slider.thumbs.children();
                }
                if (thumbLocation === "left" || thumbLocation ==="right") {
                    width = thumbs.outerWidth(true);
                }
                else if (thumbLocation !== false) {
                    height = thumbs.outerHeight(true);
                }
                slider = $.extend( {
                    width: parseInt(slider.root.css("width"), 10) + width,
                    height: parseInt(slider.root.css("height"), 10) + height
                }, slider);
                var wrapWidth = slider.width - width;
                var wrapHeight = slider.height - height;
                height = slider.height;
                width = slider.width;
                wrapHeight -= (slider.root.data("options").useProgressBar === true)?slider.timerWrap.outerHeight():0;
                slider.wrap.addClass('slider');
                if (slider.root.data("options").responsive === false && slider.root.data("options").fullscreen === false) {
                    slider.root.css( { width: width, height: height } );
                }
                else if (slider.width < parentWidth && slider.root.data("options").fullscreen === false) {
                    slider.root.css( { width: width, height: height } );
                }
                else {
                    if (slider.root.data("options").fullscreen === true) {
                        $("body").addClass("dataslider-fullscreen");
                        width = $(window).width() -  (slider.root.outerWidth() - slider.root.width());
                        wrapWidth = width;
                        height = $(window).height()  - (slider.root.outerHeight() - slider.root.height());
                        wrapHeight= height;
                    }
                    else {
                        width = parentWidth - (slider.root.outerWidth() - slider.root.width());
                        wrapWidth = width;
                    }
                    if (thumbLocation === "left" || thumbLocation ==="right") {
                        wrapWidth -= thumbs.outerWidth();
                    }
                    else if (thumbLocation !== false) {
                        wrapHeight -= thumbs.outerHeight();
                    }

                    slider.root.css( { width: width, height: height } );
                }
                slider.wrap.css( { 'position': "relative", 'overflow': "hidden", 'width': wrapWidth, 'height': wrapHeight } );
                if (thumbLocation === "top" || thumbLocation === "bottom") {
                    slider.thumbsWrap.css( { width: slider.wrap.width(), height: thumbs.outerHeight(true) } );
                    slider.thumbs.css( { width: (thumbs.outerWidth() * thumbs.length) });
                    slider.thumbsWrap.addClass("thumbs-wrap-" + thumbLocation);
                }
                else if (thumbLocation !== false) {
                    slider.buttonLeft.addClass("button-thumb-" + thumbLocation);
                    slider.thumbsWrap.css( { height: slider.wrap.height(), width: thumbs.outerWidth(true) } );
                    slider.thumbs.css ({ height: (thumbs.outerHeight() * thumbs.length) });
                    slider.thumbsWrap.addClass("thumbs-wrap-" + thumbLocation);
                }
            },
            listenKeyboard: function() {
                document.addEventListener("keydown", function ( event ) {
                    if ( event.keyCode === 9 || ( event.keyCode >= 32 && event.keyCode <= 34 ) || (event.keyCode >= 37 && event.keyCode <= 40) ) {
                        event.preventDefault();
                    }
                }, false);
                document.addEventListener("keyup", function ( event ) {
                    if ( event.keyCode === 9 || ( event.keyCode >= 32 && event.keyCode <= 34 ) || (event.keyCode >= 37 && event.keyCode <= 40) ) {
                        switch( event.keyCode ) {
                            case 33: // pg up
                            case 37: // left
                            case 38: // up
                                slider.prev();
                                break;
                            case 9:  // tab
                            case 32: // space
                            case 34: // pg down
                            case 39: // right
                            case 40: // down
                                slider.next();
                                break;
                        }
                        event.preventDefault();
                    }
                }, false);
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
            useButtons: false, //options "hover", "always", true, false
            centerButtons: true,
            useNavs: false,
            useStartStop: false,
            useProgressBar: false,
            useThumbnails: false, //options: "top", "left", "right", "bottom", true, false
            circularThumbnails: true,
            useKeyboard: true,
            defaultTransition: "blend",
            defaultTiming: 5000,
            autoPlay: true,
            loop: true,
            rememberLocation: false, //not currently implemented
            hoverPause: false,
            extraAnimations: false,
            responsive: true,
            fullscreen: true
        }, options);
        this.each(function () {
            new Dataslider($(this), options);
        });
    };
})(jQuery);