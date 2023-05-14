function initMap(id, lat, lng, zoom, marker_url, style) {
    var location = { lat: parseFloat(lat), lng: parseFloat(lng) };
    var map = new google.maps.Map(document.getElementById(id), {
        zoom: parseInt(zoom),
        center: location,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: JSON.parse(style),
    });

    var marker_args = {
        position: location,
        map: map,
        icon: marker_url,
    }
    if (marker_url !== undefined) {
        marker_args.icon = marker_url;
    }
    var marker = new google.maps.Marker(marker_args);
};

(function ($, elementor) {
    "use strict";

    var DymixEssential = {

        init: function () {
            var widgets = {
                'dm-slider.default': DymixEssential.Hero_slider,
                'dm-offices.default': DymixEssential.Offices_slider,
                'dm-post-grid.default': DymixEssential.Post_Grid,
                'dm-post-slider.default': DymixEssential.Post_slider,
                'dm-review-slider.default': DymixEssential.Review_slider,
                'dm-map.default': DymixEssential.Map,
                'dm-number-box.default': DymixEssential.NumberCountres,
            };

            $.each(widgets, function (widget, callback) {
                elementor.hooks.addAction('frontend/element_ready/' + widget, callback);
            });
        },
        isInViewport: function (elem) {
            var bounding = elem.getBoundingClientRect();
            return (
                bounding.top >= 0 &&
                bounding.left >= 0 &&
                bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        NumberCountres: function ($scope) {
            var numberWrap = $scope.find('.dm-number');
            if ($('body').hasClass('elementor-editor-active') || numberWrap.hasClass('no-js')) {
                return false;
            }

            var options = {
                separator: '',
            };

            var isInViewport = function (elem) {
                var bounding = elem.getBoundingClientRect();
                return (
                    bounding.top >= 0 &&
                    bounding.left >= 0 &&
                    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            };

            var target = $scope.attr('data-id'),
                number = $('#dm-number-' + target),
                numberVal = number.attr('data-val'),
                numberPos = number.offset().top,
                numberPosMax = numberPos + $(window).height();
            var counter = new countUp.CountUp('dm-number-' + target, numberVal, options);

            if (counter.error) {
                number.text(numberVal);
            }

            window.addEventListener('scroll', function (event) {
                if (isInViewport(number[0])) {
                    counter.start();
                }
            }, false);
        },

        Map: function ($scope) {
            var $map = $scope.find('.js-dm-map'),
                marker = $map.attr('data-marker');
            if (!marker) marker = '';
            initMap($map.attr('id'), $map.attr('data-lat'), $map.attr('data-lng'), $map.attr('data-zoom'), $map.attr('data-marker'), $map.attr('data-style'));
        },

        initSlickSlider($slider) {
            console.log($slider);
                var sliderTimer = 10000;
                var beforeEnd = 500;
                var $slideNumber = $('.hero__slider__nav .number__slide');
                var $slidesNumber = $('.hero__slider__nav .number__slides');

                $slider.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
                    //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
                    var i = (currentSlide ? currentSlide : 0) + 1;
                    $slideNumber.text(i);
                    $slidesNumber.text('/' + slick.slideCount);

                });

                $slider.slick({
                    autoplay: true,
                    autoplaySpeed: sliderTimer,
                    speed: 1000,
                    arrows: true,
                    fade: true,
                    prevArrow: $('.hero__slider__nav .slider__nav .nav-prev'),
                    nextArrow: $('.hero__slider__nav .slider__nav .nav-next'),
                    dots: false,
                    adaptiveHeight: true,
                    pauseOnFocus: false,
                    pauseOnHover: false,
                });

                function progressBar() {
                    $('.hero__slider__nav .glide__progress').find('.square').removeAttr('style');
                    $('.hero__slider__nav .glide__progress').find('.square').removeClass('active');
                    setTimeout(function () {
                        $('.hero__slider__nav .glide__progress').find('.square').css('animation-duration', (sliderTimer / 1000) + 's').addClass('active');
                    }, 1000);
                }
                progressBar();
                $slider.on('beforeChange', function (e, slick) {
                    progressBar();
                });

            
        },
        initPostSlickSlider($slider) {
                var is_hide_nav_mob = $slider.attr('data-hide-navs'),
                    show_numeration = $slider.attr('data-numeration'),
                    ppr_mobile = $slider.attr('data-ppr-mobile'),
                    ppr_tablet = $slider.attr('data-ppr-tablet');
                var tablet_settings = {
                    draggable: true,
                    swipe: true
                };
                var mobile_settings = {};

                if ('on' === is_hide_nav_mob ) {
                    tablet_settings['arrows'] = false;
                    tablet_settings['dots'] = true;
                }
                if (ppr_tablet) {
                    tablet_settings['slidesToShow'] = parseInt(ppr_tablet);
                    tablet_settings['slidesToScroll'] = 1;
                }

                if (ppr_mobile) {
                    mobile_settings['slidesToShow'] = parseInt(ppr_mobile);
                    mobile_settings['slidesToScroll'] = 1;
                }

                if ( 'on' === show_numeration ) {

                    $slider.on('init reInit', function (event, slick) {
                        if ( !slick.$slider.find('.js-slick-count').length ) {
                            slick.$slider.after('<div class="slick-counter js-slick-count"></div>');
                        }
                    });

                    $slider.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
                        var i = (currentSlide ? currentSlide : 0) + 1,
                            j = slick.slideCount;
                        if (i < 10) i = '0' + i;
                        if (j < 10) j = '0' + j;

                        var counter = slick.$slider.find('.slick-current .js-slick-count');
                        if ( !slick.$slider.find('.js-slick-count').length ) {
                            counter = slick.$slider.next('.js-slick-count')
                        }
                        counter.html(i + ' <span class="slick-counter__sep"></span> ' + j);
                    });
                }

                $slider.slick({
                    prevArrow: '<button type="button" class="slick-prev"></button>',
                    nextArrow: '<button type="button" class="slick-next"></button>',
                    responsive: [
                        {
                            breakpoint: 992,
                            settings: tablet_settings
                        },
                        {
                            breakpoint: 768,
                            settings: mobile_settings
                        }
                    ]
                });
        },

        Hero_slider: function ($scope) {
            var $slider = $scope.find('.hero__slider');

            // $slider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
            //     var decl = currentSlide - nextSlide;

            //     if (decl == 1 || decl == (slick.slideCount - 1) * (-1)) {
            //         $slider.addClass('is-prev').removeClass('is-next');
            //     } else {
            //         $slider.addClass('is-next').removeClass('is-prev');
            //     }
            // });

            // $slider.on('afterChange', function (event, slick, currentSlide) {
            //     //$slider.removeClass('is-prev').removeClass('is-next');
            // });

            DymixEssential.initSlickSlider($slider);
        },
        Post_slider: function ($scope) {
            DymixEssential.initPostSlickSlider($scope.find('.js-post-slider'));
        },

        Offices_slider: function ($scope) {
            var $container = $scope.find('.js-offices-carousel');

            $container.on('init', function (event, slick) {
                $('.js-offices-dots').appendTo('.js-offices-nav');
                $(slick.$slides).each(function (index, element) {
                    $('.js-offices-nav').append('<li><a href="#0" class="js-to-step" data-slide="' + index + '">' + $(element).find('.js-office-item-title').text() + '</a></li>');
                });
                $('.js-offices-nav li:first-child').addClass('slick-active');
            });

            $container.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                $('.js-offices-nav .slick-active').removeClass('slick-active');
                $('.js-offices-nav li').eq(nextSlide).addClass('slick-active');
            });

            $(document).on('click', '.js-to-step', function (event) {
                var nextSlide = $(this).attr('data-slide');
                $container.slick('slickGoTo', nextSlide);
            });

            $container.slick({
                infinite: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: false,
                fade: true,
                arrows: false,
                draggable: false,
                swipe: false,
                dots: true,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            draggable: true,
                            swipe: true
                        }
                    }
                ]
            });
        },

        Review_slider: function ($scope) {
            var $slider = $scope.find('.dm-review-slider'),
                $images = $scope.find('.dm-review-slider-image');

            $slider.on('init reInit', function (event, slick) {
                $images.find('img:first-child').addClass('active');
            });

            $slider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                var decl = currentSlide - nextSlide;

                if (decl == 1 || decl == (slick.slideCount - 1) * (-1)) {
                    $images.addClass('is-prev').removeClass('is-next');
                } else {
                    $images.addClass('is-next').removeClass('is-prev');
                }
                var curr_id = slick.$slides[nextSlide].getAttribute('data-id');
                $images.find('img.active').removeClass('active');
                $images.find('img[data-slide-id="' + curr_id + '"]').addClass('active');
            });
            DymixEssential.initSlickSlider($slider);
        },

        Post_Grid: function ($scope, $) {
            var $wrapper = $scope.find('.dm-post-grid-wrap');
            var wid = $scope.data('id');

            var $container = $('.elementor-element-' + wid + ' .post-list');

            var layoutMode = $wrapper.hasClass('is-masonry') ? 'masonry' : 'grid';

            if (layoutMode === 'masonry') {
                var $grid = $container.masonry({
                    columnWidth: '.post-item',
                    percentPosition: true,
                });

                $grid.imagesLoaded().done(function () {
                    $grid.masonry('layout');
                });
            }

            $('.navigation-type-load_more').on('click', '.js-post-load__btn', function (e) {
                var offset = $(this).attr('data-offset');
                $(this).attr('data-offset', parseInt(offset) + 1);

                DymixEssential.loadPosts($wrapper, 'load_more');
            });

            $(document).on('click', '.project-filter__btn', function (e) {
                e.preventDefault();
                if (!$(this).hasClass('active')) {
                    $(this).closest('.js-post-filter-category').find('.active').removeClass('active');
                    $(this).addClass('active');

                    DymixEssential.loadPosts($wrapper, 'filter');
                }
            });

            $(document).on('click', '.fund-filter__btn', function (e) {
                e.preventDefault();

                $(this).toggleClass('active');

                DymixEssential.loadPosts($wrapper, 'filter');
            });

            $(document).on('click', '.js-pagination-page', function (e) {
                e.preventDefault();
                if (!$(this).hasClass('current')) {
                    $(this).closest('.js-post-load__pagination').find('.current').removeClass('current');
                    $(this).addClass('current');

                    DymixEssential.loadPosts($wrapper, 'pagination');
                }
            });

            var loading = false;

            $(window).scroll(function () {
                var scrollPoint = $('.navigation-type-infinite');
                if (scrollPoint.length) {
                    var hT = scrollPoint.offset().top,
                        hH = scrollPoint.outerHeight(),
                        wH = $(window).height(),
                        wS = $(this).scrollTop();
                    if (wS > (hT + hH - wH) && (hT > wS) && (wS + wH > hT + hH)) {
                        if (!loading) {
                            DymixEssential.loadPosts($wrapper, 'infinite');
                            loading = true;
                        }
                    }
                }
            });
        },

        loadPosts: function ($wrapper, load_type = 'load_more') {
            if ($('body').hasClass('elementor-editor-active')) {
                return false;
            }
            var $list = $wrapper.find('.js-post-load__list'),
                $nav = $wrapper.find('.post-navigation'),
                args = $wrapper.find('.js-query-args').val(),
                filter_cat = $wrapper.find('.js-post-filter-category'),
                filter_fund = $wrapper.find('.js-post-filter-fund');

            if (!args) { return }

            args = JSON.parse(args);
            var offset = 0,
                total = 0;

            if (load_type === 'load_more') {
                offset = $wrapper.find('.js-post-load__btn').attr('data-offset');
                total = $wrapper.find('.js-post-load__btn').attr('data-max');
            }

            args['offset'] = offset;

            console.log(offset);

            var total_pages = args.total;

            if (filter_cat) {
                args.category_name = filter_cat.find('.active').attr('data-filter');
            }
            if (filter_fund && filter_fund.find('.active').length) {
                var active_fund = [];
                filter_fund.find('.active').each(function (index, el) {
                    active_fund.push(el.getAttribute('data-filter'));
                });
                args.fund_category = active_fund;
            }
            if (load_type === 'filter') {
                args.offset = 0;
            }
            args['action'] = 'load_post_action';

            //console.log(args);

            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: load_post_url.ajaxurl,
                data: args,
                beforeSend: function () {
                    if (load_type !== 'pagination') {
                        $nav.addClass('loading');
                    } else {
                        $list.addClass('loading');
                    }
                },
                success: function (data) {
                    var $posts = $(data.items);
                    var $new_nav = $(data.nav);

                    if ($posts.length) {
                        if (load_type === 'load_more' || load_type === 'infinite') {

                            // If infinite scroll
                            $list.append($posts);

                            // Remove loader when all post have been loaded
                            if (total == offset) {
                                $nav.find('.js-post-load__btn').remove();
                            }

                        } else {
                            $list.empty().append($posts);

                            if (load_type === 'pagination') {
                                // If pager
                                $('html, body').animate({
                                    scrollTop: $list.parent().offset().top - 50
                                }, 700);
                            } else {
                                // If filter
                                console.log('here');
                                $nav.empty();
                            }
                        }
                    }

                    if ($new_nav.length) {
                        $nav.html($new_nav);
                    }


                    if (load_type !== 'pagination') {
                        $nav.removeClass('loading');
                    } else {
                        $list.removeClass('loading');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log($.parseJSON(jqXHR.responseText) + ' :: ' + textStatus + ' :: ' + errorThrown);
                }
            });
        },
    };

    $(window).on('elementor/frontend/init', DymixEssential.init);

    function accordionClick() {
        var tabHeader = $(this),
            tabBody = $(tabHeader.attr('data-target')),
            accordion = $(tabBody.attr('data-parent'));


        if (tabHeader.hasClass('collapsed')) {
            // Close sibling if multiply not allowed
            if (!accordion.hasClass('allow-multiply')) {
                accordion.find('.dm-accordion-item__header:not(.collapsed)').addClass('collapsed').next().slideUp().removeClass('show');
            }

            // Open current tab
            tabBody.slideDown().addClass('show');
            tabHeader.removeClass('collapsed');

        } else {
            // Close current tab
            tabBody.slideUp().removeClass('show');
            tabHeader.addClass('collapsed');
        }
    }

    $(document).on('click', '.dm-accordion-item__header', accordionClick);

    $('#js-office-map-modal').on('show.bs.modal', function (e) {
        var title = $(e.relatedTarget).attr('data-title');
        var address = $(e.relatedTarget).attr('data-address');
        var zoom = parseInt($(e.relatedTarget).attr('data-zoom'));
        var encoded = encodeURIComponent(address);
        var map = `<iframe scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q=${encoded}&amp;t=m&amp;z=${zoom}&amp;output=embed&amp;iwloc=near" aria-label="${address}"></iframe>`;
        $(e.target).find('.elementor-custom-embed').empty().append(map);
        $(e.target).find('.modal-title').text(title);
    });


}(jQuery, window.elementorFrontend));

