$(document).ready(function () {


    /* =====================================================
       HEADER
    ====================================================== */

    function updateHeader() {

        if ($(window).scrollTop() > 50) {

            $('.site-header').addClass('scrolled');

        } else {

            $('.site-header').removeClass('scrolled');

        }

    }

    $(window).on('scroll', updateHeader);

    updateHeader();


    /* =====================================================
       MOBILE MENU
    ====================================================== */

    $('.menu-button').on('click', function () {

        $('.mobile-menu').stop(true, true).fadeToggle(300);

    });


    $('.mobile-menu a').on('click', function () {

        $('.mobile-menu').fadeOut(300);

    });


    /* =====================================================
       SMOOTH SCROLL
    ====================================================== */

    $('a[href^="#"]').on('click', function (e) {

        const target = $(this).attr('href');

        if ($(target).length) {

            e.preventDefault();

            $('html, body').animate({

                scrollTop: $(target).offset().top

            }, 900);

        }

    });


    /* =====================================================
       HERO MOUSE PARALLAX
    ====================================================== */

    $('.hero-v3').on('mousemove', function (e) {

        const hero = $(this);

        const width = hero.width();
        const height = hero.height();

        const mouseX = (e.clientX / width) - 0.5;
        const mouseY = (e.clientY / height) - 0.5;


        $('.hero-v3-bg').css({

            transform:
                'scale(1.08) translate(' +
                mouseX * -12 +
                'px,' +
                mouseY * -12 +
                'px)'

        });


        $('.anniversary-stage').css({

            marginLeft: mouseX * 20 + 'px',

            marginTop: mouseY * 20 + 'px'

        });


        $('.hero-copy').css({

            marginLeft: mouseX * -8 + 'px'

        });

    });


    /* =====================================================
       HERO TIMELINE
    ====================================================== */

    function updateHeroTimeline() {

        const scrollTop = $(window).scrollTop();

        const heroHeight = $('.hero-v3').height();

        let progress =
            (scrollTop / heroHeight) * 100;

        progress = Math.max(
            0,
            Math.min(progress, 100)
        );

        $('.timeline-progress').css(
            'width',
            progress + '%'
        );

    }

    $(window).on(
        'scroll',
        updateHeroTimeline
    );


    /* =====================================================
       HERO SCROLL EFFECT
    ====================================================== */

    function heroScrollEffect() {

        const scrollTop = $(window).scrollTop();

        const heroHeight = $('.hero-v3').height();

        let progress =
            scrollTop / heroHeight;

        progress = Math.max(
            0,
            Math.min(progress, 1)
        );


        $('.hero-number').css({

            transform:
                'translate(-50%, calc(-50% + ' +
                progress * 100 +
                'px)) scale(' +
                (1 + progress * 0.3) +
                ')',

            opacity:
                1 - progress * 0.7

        });


        $('.anniversary-stage').css({

            opacity:
                1 - progress * 0.8

        });


        $('.hero-copy').css({

            opacity:
                1 - progress * 1.2

        });


        $('.hero-v3-bg').css({

            filter:
                'brightness(' +
                (0.65 - progress * 0.35) +
                ')'

        });

    }

    $(window).on(
        'scroll',
        heroScrollEffect
    );


    /* =====================================================
       REVEAL ANIMATION
    ====================================================== */

    function revealElements() {

        const windowHeight = $(window).height();

        $('.reveal').each(function () {

            const elementTop =
                $(this).offset().top;

            const scrollTop =
                $(window).scrollTop();

            if (
                elementTop <
                scrollTop +
                windowHeight -
                80
            ) {

                $(this).addClass('visible');

            }

        });

    }

    $(window).on(
        'scroll',
        revealElements
    );

    revealElements();


    /* =====================================================
       OUR STORY TIMELINE
    ====================================================== */

    function updateStoryTimeline() {

        const $timeline =
            $('.story-timeline');

        const $stories =
            $('.story-item');


        if (
            !$timeline.length ||
            !$stories.length
        ) {
            return;
        }


        const windowHeight =
            $(window).height();

        const scrollTop =
            $(window).scrollTop();


        /*
         * The active point is around
         * 50% of the viewport.
         */

        const viewportCenter =
            scrollTop +
            (windowHeight * 0.50);


        let activeIndex = 0;


        /* -----------------------------------------------
           Find active story
        ------------------------------------------------ */

        $stories.each(function (index) {

            const $story =
                $(this);

            const storyTop =
                $story.offset().top;

            const storyHeight =
                $story.outerHeight();

            const storyCenter =
                storyTop +
                (storyHeight / 2);


            if (
                viewportCenter >=
                storyCenter
            ) {

                activeIndex = index;

            }

        });


        /* -----------------------------------------------
           Apply active/completed
        ------------------------------------------------ */

        $stories.each(function (index) {

            const $story =
                $(this);

            $story.removeClass(
                'active completed'
            );


            if (index === activeIndex) {

                $story.addClass('active');

            }


            if (index < activeIndex) {

                $story.addClass('completed');

            }

        });


        /* -----------------------------------------------
           Calculate red line progress
        ------------------------------------------------ */

        const timelineTop =
            $timeline.offset().top;

        const timelineHeight =
            $timeline.outerHeight();


        const activeStory =
            $stories.eq(activeIndex);


        const activeStoryTop =
            activeStory.offset().top;

        const activeStoryHeight =
            activeStory.outerHeight();


        const activeDotPosition =
            (activeStoryTop - timelineTop) +
            (activeStoryHeight / 2);


        let progress =
            (activeDotPosition /
                timelineHeight) *
            100;


        progress = Math.max(
            0,
            Math.min(progress, 100)
        );


        $timeline.css(
            '--timeline-progress',
            progress + '%'
        );

    }


    $(window).on(
        'scroll',
        updateStoryTimeline
    );


    $(window).on(
        'resize',
        updateStoryTimeline
    );


    setTimeout(
        updateStoryTimeline,
        300
    );


    /* =====================================================
       STORY IMAGE PARALLAX
    ====================================================== */

    function storyImageEffect() {

        $('.story-image').each(function () {

            const $image =
                $(this);

            const imageTop =
                $image.offset().top;

            const imageHeight =
                $image.outerHeight();

            const scrollTop =
                $(window).scrollTop();

            const windowHeight =
                $(window).height();


            if (
                imageTop <
                scrollTop +
                windowHeight &&
                imageTop + imageHeight >
                scrollTop
            ) {

                const distance =
                    (
                        scrollTop +
                        windowHeight / 2 -
                        imageTop
                    ) * 0.03;


                $image.find('img').css(
                    'transform',
                    'scale(1.04) translateY(' +
                    distance +
                    'px)'
                );

            }

        });

    }

    $(window).on(
        'scroll',
        storyImageEffect
    );


    /* =====================================================
       IMPACT CARD NUMBER ANIMATION
    ====================================================== */

    $('.impact-card').each(function (index) {

        $(this).css(
            'transition-delay',
            (index * 0.08) + 's'
        );

    });


    $('.value-card').each(function (index) {

        $(this).css(
            'transition-delay',
            (index * 0.08) + 's'
        );

    });


    /* =====================================================
       PREVENT IMAGE DRAG
    ====================================================== */

    $('img').on(
        'dragstart',
        function (e) {

            e.preventDefault();

        }
    );


    /* =====================================================
       INITIAL UPDATE
    ====================================================== */

    updateHeroTimeline();

    heroScrollEffect();

    updateStoryTimeline();

});