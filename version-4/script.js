$(document).ready(function () {


    /* =====================================================
       CORE
    ===================================================== */

    let targetScroll = 0;
    let currentScroll = 0;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let smoothMouseX = mouseX;
    let smoothMouseY = mouseY;


    /* =====================================================
       HELPERS
    ===================================================== */

    function clamp(value, min, max) {

        return Math.max(min, Math.min(max, value));

    }


    function ease(value) {

        return value * value * (3 - 2 * value);

    }


    function sectionProgress($section) {

        const start = $section.offset().top;

        const distance =
            $section.outerHeight() -
            window.innerHeight;

        return clamp(
            (currentScroll - start) /
            Math.max(distance, 1),
            0,
            1
        );

    }


    /* =====================================================
       LOADER
    ===================================================== */

    let loaderValue = 0;

    const loaderTimer = setInterval(function () {

        loaderValue += Math.floor(Math.random() * 4) + 1;

        if (loaderValue >= 100) {

            loaderValue = 100;

            clearInterval(loaderTimer);

        }

        $(".loader-percent").text(loaderValue + "%");

        $(".loader-line i").css(
            "width",
            loaderValue + "%"
        );

        $(".loader-fill").css(
            "clip-path",
            "inset(" +
            (100 - loaderValue) +
            "% 0 0 0)"
        );

    }, 35);


    setTimeout(function () {

        $(".loader").css({
            clipPath: "circle(0% at 50% 50%)",
            transition:
                "clip-path 1.5s cubic-bezier(.16,1,.3,1)"
        });

        setTimeout(function () {

            $(".loader").remove();

        }, 1500);

    }, 3800);



    /* =====================================================
       MENU
    ===================================================== */

    $(".menu-button").on("click", function () {

        $("body").toggleClass("menu-open");

    });


    $(".menu-overlay a").on("click", function () {

        $("body").removeClass("menu-open");

    });



    /* =====================================================
       CURSOR
    ===================================================== */

    $(document).on("mousemove", function (event) {

        mouseX = event.clientX;
        mouseY = event.clientY;

    });


    $("a, button, .world-item, .journey-card")
        .on("mouseenter", function () {

            $(".cursor").addClass("active");

        })
        .on("mouseleave", function () {

            $(".cursor").removeClass("active");

        });



    /* =====================================================
       SCROLL
    ===================================================== */

    $(window).on("scroll", function () {

        targetScroll = window.scrollY;

    });



    /* =====================================================
       HERO
    ===================================================== */

    function heroAnimation() {

        const $section = $(".hero");

        const p = sectionProgress($section);
        const e = ease(p);


        /*
         * The 81 becomes enormous.
         * Instead of simply fading it,
         * it becomes the transition itself.
         */

        const scale =
            1 + e * 4.5;


        $(".hero-81").css({

            transform:
                "scale(" +
                scale +
                ") translateX(" +
                e * 5 +
                "vw)"

        });


        /*
         * Fill disappears as the giant 81
         * approaches the next scene.
         */

        $(".hero-81-solid").css({

            clipPath:
                "inset(" +
                (e * 100) +
                "% 0 0 0)"

        });


        $(".hero-heading").css({

            transform:
                "translateX(" +
                (-e * 15) +
                "vw) scale(" +
                (1 - e * .15) +
                ")",

            opacity:
                1 - e

        });


        /*
         * Background camera movement.
         */

        $(".hero-video").css({

            transform:
                "scale(" +
                (1 + e * .3) +
                ") translate3d(" +
                ((smoothMouseX -
                    window.innerWidth / 2) * -.003) +
                "px," +
                ((smoothMouseY -
                    window.innerHeight / 2) * -.003) +
                "px,0)"

        });


        $(".hero-ring").each(function (index) {

            const amount =
                (index + 1) * 40;

            $(this).css({

                transform:
                    "translate(-50%, -50%) " +
                    "scale(" +
                    (1 + e * amount / 100) +
                    ") rotate(" +
                    e * (index % 2 ? -20 : 20) +
                    "deg)"

            });

        });


        $(".hero-floating-one").css(
            "transform",
            "translate3d(" +
            e * -20 +
            "vw," +
            e * 12 +
            "vh,0)"
        );

        $(".hero-floating-two").css(
            "transform",
            "translate3d(" +
            e * 20 +
            "vw," +
            e * -10 +
            "vh,0)"
        );

        $(".hero-floating-three").css(
            "transform",
            "translate3d(" +
            e * -10 +
            "vw," +
            e * -15 +
            "vh,0)"
        );

    }



    /* =====================================================
       RISE — FIXED
    ===================================================== */

    function riseAnimation() {

        const $section = $(".rise");

        const p = sectionProgress($section);
        const e = ease(p);


        /*
         * Background RISE zooms massively.
         */

        $(".rise-bg-word").css({

            transform:
                "scale(" +
                (0.8 + e * 2.5) +
                ") rotate(" +
                e * 8 +
                "deg)"

        });


        /*
         * Central RISE:
         *
         * 0% = black
         * 45% = red
         * 100% = completely gone
         */

        let riseColor;

        if (p < .45) {

            riseColor = "#050505";

        } else {

            riseColor = "#ed1c24";

        }


        $(".rise-center h2").css({

            color: riseColor,

            transform:
                "scale(" +
                (1 + e * .7) +
                ") translateY(" +
                (-e * 8) +
                "vh)"

        });


        /*
         * IMPORTANT:
         * This fixes the text that previously remained
         * visible after the zoom.
         */

        $(".rise-center").css({

            opacity:
                p > .62
                    ? clamp(
                        1 -
                        ((p - .62) / .38),
                        0,
                        1
                    )
                    : 1

        });


        /*
         * Supporting orbit labels disappear earlier.
         */

        $(".rise-orbit-text").each(function (index) {

            const delay =
                index * .04;

            const opacity =
                clamp(
                    1 -
                    ((p - (.48 + delay)) / .25),
                    0,
                    1
                );

            $(this).css({

                opacity: opacity,

                transform:
                    "translate3d(" +
                    ((index % 2 ? 1 : -1) * e * 20) +
                    "vw," +
                    ((index % 2 ? -1 : 1) * e * 15) +
                    "vh,0) rotate(" +
                    e * (index % 2 ? 15 : -15) +
                    "deg)"

            });

        });


        /*
         * Rings zoom away.
         */

        $(".rise-ring").each(function (index) {

            $(this).css({

                transform:
                    "translate(-50%, -50%) " +
                    "scale(" +
                    (1 + e * (1 + index * .7)) +
                    ") rotate(" +
                    e * (index % 2 ? -100 : 100) +
                    "deg)",

                opacity:
                    1 - e * .7

            });

        });


        /*
         * TOGETHER enters only near the end.
         */

        const exitProgress =
            clamp(
                (p - .65) / .35,
                0,
                1
            );

        $(".rise-exit-word").css({

            opacity:
                exitProgress,

            transform:
                "translateY(" +
                (100 - exitProgress * 100) +
                "%) scale(" +
                (.8 + exitProgress * .4) +
                ")"

        });

    }



    /* =====================================================
       ORIGIN
    ===================================================== */

    function originAnimation() {

        const $section = $(".origin");

        const p = sectionProgress($section);
        const e = ease(p);


        $(".origin-image-inner").css({

            transform:
                "scale(" +
                (1.15 - e * .12) +
                ") translateX(" +
                (-e * 5) +
                "%)"

        });


        $(".origin-image").css({

            clipPath:
                "inset(" +
                (e * 5) +
                "% " +
                (e * 8) +
                "% " +
                (e * 5) +
                "% 0)"

        });


        $(".origin-year").css({

            transform:
                "translate3d(" +
                (-e * 12) +
                "vw," +
                (e * 8) +
                "vh,0)"

        });


        $(".origin-copy").css({

            transform:
                "translate3d(" +
                (e * 5) +
                "vw," +
                (-e * 4) +
                "vh,0)"

        });

    }



    /* =====================================================
       JOURNEY
    ===================================================== */

    function journeyAnimation() {

        const $section = $(".journey");

        const p = sectionProgress($section);
        const e = ease(p);


        const trackWidth =
            $(".journey-track").outerWidth();

        const maxMove =
            trackWidth -
            window.innerWidth;


        $(".journey-track").css({

            transform:
                "translate3d(" +
                (-maxMove * e) +
                "px,0,0)"

        });


        $(".journey-line span").css(
            "width",
            (e * 100) + "%"
        );


        $(".journey-card").each(function () {

            const $card = $(this);

            const offset =
                $card.position().left;

            const viewportCenter =
                window.innerWidth * .5;

            const current =
                offset -
                maxMove * e;

            const distance =
                current -
                viewportCenter;

            const normalized =
                clamp(
                    Math.abs(distance) /
                    window.innerWidth,
                    0,
                    1
                );


            $card.find(".journey-image").css({

                transform:
                    "scale(" +
                    (1 - normalized * .1) +
                    ")"

            });

        });

    }



    /* =====================================================
       OUR WORLD — NEW
    ===================================================== */

    function worldAnimation() {

        const $section = $(".world");

        const p = sectionProgress($section);
        const e = ease(p);


        /*
         * Giant background word moves horizontally.
         */

        $(".world-bg").css({

            transform:
                "translate3d(" +
                (-e * 18) +
                "vw," +
                (e * -4) +
                "vh,0) scale(" +
                (1 + e * .25) +
                ")"

        });


        /*
         * Portal becomes the visual centre.
         */

        $(".world-portal").css({

            transform:
                "translate(-50%, -50%) " +
                "scale(" +
                (0.72 + e * .65) +
                ") rotate(" +
                e * 180 +
                "deg)"

        });


        $(".portal-inner").css({

            transform:
                "rotate(" +
                (-e * 180) +
                "deg) scale(" +
                (1 + e * .15) +
                ")"

        });


        /*
         * Ecosystem words orbit around the portal.
         */

        $(".world-item").each(function (index) {

            const $item = $(this);

            const directions = [
                [-35, -18],
                [30, -15],
                [42, 15],
                [-32, 22],
                [20, -25],
                [-18, 28],
                [28, 25],
                [-40, 5]
            ];

            const movement =
                directions[index];

            $item.css({

                transform:
                    "translate3d(" +
                    movement[0] * e +
                    "vw," +
                    movement[1] * e +
                    "vh,0) rotate(" +
                    (index % 2 ? e * 8 : -e * 8) +
                    "deg)"

            });

        });


        /*
         * Intro moves away as the visual world opens.
         */

        $(".world-intro").css({

            transform:
                "translate3d(" +
                (-e * 8) +
                "vw," +
                (-e * 5) +
                "vh,0)",

            opacity:
                1 - e * .7

        });


        /*
         * Stats rise into the final composition.
         */

        $(".world-stats").css({

            transform:
                "translateY(" +
                (-e * 3) +
                "vh)"

        });


        $(".world-cursor-text").css({

            transform:
                "translate3d(" +
                ((smoothMouseX -
                    window.innerWidth / 2) * .015) +
                "px," +
                ((smoothMouseY -
                    window.innerHeight / 2) * .015) +
                "px,0) rotate(" +
                e * 90 +
                "deg)"

        });

    }



    /* =====================================================
       IMPACT — FIXED
    ===================================================== */

    function impactAnimation() {

        const $section = $(".impact");

        const p = sectionProgress($section);
        const e = ease(p);


        /*
         * Background stays inside viewport.
         */

        $(".impact-background").css({

            transform:
                "translate(-50%, -50%) " +
                "scale(" +
                (0.8 + e * .9) +
                ")"

        });


        /*
         * Heading exits toward upper left,
         * but doesn't affect the numbers.
         */

        $(".impact-heading").css({

            transform:
                "translate3d(" +
                (-e * 8) +
                "vw," +
                (-e * 6) +
                "vh,0)",

            opacity:
                1 - e * .8

        });


        /*
         * IMPORTANT:
         * Numbers move TOWARDS the centre instead of
         * flying outside the viewport.
         */

        $(".impact-number-one").css({

            transform:
                "translate3d(" +
                (e * 17) +
                "vw," +
                (-e * 5) +
                "vh,0) scale(" +
                (1 - e * .22) +
                ")"

        });


        $(".impact-number-two").css({

            transform:
                "translate3d(" +
                (-e * 17) +
                "vw," +
                (e * 8) +
                "vh,0) scale(" +
                (1 - e * .22) +
                ")"

        });


        $(".impact-number-three").css({

            transform:
                "translate3d(" +
                (-e * 4) +
                "vw," +
                (-e * 10) +
                "vh,0) scale(" +
                (1 - e * .18) +
                ")"

        });


        /*
         * Fade numbers only after they have reached
         * the safe centre zone.
         */

        const numberOpacity =
            clamp(
                1 -
                ((p - .7) / .3),
                0,
                1
            );


        $(".impact-number").css(
            "opacity",
            numberOpacity
        );


        /*
         * Red core grows but remains completely visible.
         */

        $(".impact-core").css({

            transform:
                "translate(-50%, -50%) " +
                "scale(" +
                (0.65 + e * .75) +
                ")",

            opacity:
                1

        });


        /*
         * Outer rings.
         */

        $(".impact-ring").each(function (index) {

            $(this).css({

                transform:
                    "translate(-50%, -50%) " +
                    "scale(" +
                    (0.7 + e * (0.7 + index * .35)) +
                    ") rotate(" +
                    e * (index % 2 ? -80 : 80) +
                    "deg)",

                opacity:
                    .9 - e * .45

            });

        });

    }



    /* =====================================================
       FUTURE
    ===================================================== */

    function futureAnimation() {

        const $section = $(".future");

        const p = sectionProgress($section);
        const e = ease(p);


        $(".future-year").css({

            transform:
                "scale(" +
                (1 + e * 1.5) +
                ") rotate(" +
                (-e * 4) +
                "deg)"

        });


        $(".future-title").css({

            transform:
                "translateY(" +
                (-e * 10) +
                "vh) scale(" +
                (1 + e * .15) +
                ")"

        });


        $(".future-grid").css({

            transform:
                "scale(" +
                (1 + e * .7) +
                ")"

        });


        $(".future-particles i").each(function (index) {

            const angle =
                index / 21 * Math.PI * 2;

            const distance =
                e * (100 + index * 5);

            const x =
                Math.cos(angle) * distance;

            const y =
                Math.sin(angle) * distance;


            $(this).css({

                transform:
                    "translate3d(" +
                    x +
                    "px," +
                    y +
                    "px,0) scale(" +
                    (1 + e * 2) +
                    ")"

            });

        });

    }



    /* =====================================================
       FINAL
    ===================================================== */

    function finalAnimation() {

        const $section = $(".final");

        const start =
            $section.offset().top;

        const p =
            clamp(
                (currentScroll -
                    start +
                    window.innerHeight * .5) /
                window.innerHeight,
                0,
                1
            );


        $(".final-title").css({

            transform:
                "translateY(" +
                (-50 - p * 8) +
                "%) scale(" +
                (1 + p * .08) +
                ")"

        });


        $(".final-giant").css({

            transform:
                "translate3d(" +
                p * 5 +
                "vw," +
                p * 4 +
                "vh,0)"

        });

    }



    /* =====================================================
       MAIN LOOP
    ===================================================== */

    function animate() {

        currentScroll +=
            (targetScroll - currentScroll) * .085;


        smoothMouseX +=
            (mouseX - smoothMouseX) * .08;

        smoothMouseY +=
            (mouseY - smoothMouseY) * .08;


        $(".cursor").css({

            left: smoothMouseX,
            top: smoothMouseY

        });


        heroAnimation();

        riseAnimation();

        originAnimation();

        journeyAnimation();

        worldAnimation();

        impactAnimation();

        futureAnimation();

        finalAnimation();


        requestAnimationFrame(animate);

    }


    animate();



    /* =====================================================
       TOUCH
    ===================================================== */

    $(document).on("touchmove", function (event) {

        if (
            event.originalEvent.touches &&
            event.originalEvent.touches.length
        ) {

            mouseX =
                event.originalEvent.touches[0].clientX;

            mouseY =
                event.originalEvent.touches[0].clientY;

        }

    });


});