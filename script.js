$(document).ready(function () {


    /* =====================================================
       HEADER
    ===================================================== */

    $(window).on("scroll", function () {

        const scrollTop = $(window).scrollTop();

        if (scrollTop > 50) {
            $(".site-header").addClass("scrolled");
        } else {
            $(".site-header").removeClass("scrolled");
        }

    });


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    $(".menu-button").on("click", function () {

        $(this).toggleClass("active");

        $(".mobile-menu").toggleClass("open");

        $("body").toggleClass("menu-open");

    });


    $(".mobile-menu a").on("click", function () {

        $(".menu-button").removeClass("active");

        $(".mobile-menu").removeClass("open");

    });


    /* =====================================================
       TITLE WORD REVEAL
    ===================================================== */

    const titleObserver = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    $(entry.target).addClass("is-visible");

                } else {

                    $(entry.target).removeClass("is-visible");

                }

            });

        },
        {
            threshold: 0.20
        }
    );


    $(".split-title").each(function () {

        titleObserver.observe(this);

    });


    /* =====================================================
       HERO SCROLL ANIMATION
    ===================================================== */

    const hero = document.querySelector(".hero");

    if (hero) {

        function updateHero() {

            const rect = hero.getBoundingClientRect();

            const scrollRange =
                hero.offsetHeight -
                window.innerHeight;

            let progress =
                -rect.top / scrollRange;

            progress =
                Math.max(
                    0,
                    Math.min(1, progress)
                );


            /*
             * ------------------------------------------------
             * PHASE 1
             *
             * Video + original 81
             * ------------------------------------------------
             */

            const small81 =
                document.querySelector(".hero-81-small");

            const video =
                document.querySelector(".hero-video");

            const orbits =
                document.querySelectorAll(".hero-orbit");


            /*
             * 81 starts growing around 5%
             */

            let smallScale = 1;

            if (progress < .42) {

                const p =
                    Math.min(
                        1,
                        Math.max(
                            0,
                            (progress - .02) / .40
                        )
                    );

                smallScale =
                    1 +
                    p * 1.4;

                small81.style.opacity =
                    1 - p * .65;

                small81.style.transform =
                    `translate(-50%, -50%) scale(${smallScale})`;

            } else {

                small81.style.opacity = "0";

            }


            /*
             * ------------------------------------------------
             * ORBIT MOVEMENT
             * ------------------------------------------------
             */

            orbits.forEach(function (orbit, index) {

                const direction =
                    index % 2 === 0
                        ? 1
                        : -1;

                const rotation =
                    progress *
                    260 *
                    direction;

                const scale =
                    1 +
                    progress * 1.2;

                orbit.style.transform =
                    `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`;

                orbit.style.opacity =
                    Math.max(
                        0,
                        1 - progress * 1.6
                    );

            });


            /*
             * ------------------------------------------------
             * BIG 81 TRANSITION
             * ------------------------------------------------
             */

            const transition =
                document.querySelector(
                    ".hero-81-transition"
                );

            const transition81 =
                document.querySelector(
                    ".transition-81"
                );


            /*
             * Start around 22%
             */

            let transitionProgress =
                (progress - .20) / .32;

            transitionProgress =
                Math.max(
                    0,
                    Math.min(
                        1,
                        transitionProgress
                    )
                );


            if (transitionProgress > 0) {

                transition.style.opacity = "1";


                /*
                 * Circle expands.
                 */

                const circleSize =
                    transitionProgress * 75;

                transition.style.clipPath =
                    `circle(${circleSize + "%"} at 50% 50%)`;


                /*
                 * Giant 81 grows.
                 */

                const numberScale =
                    .05 +
                    transitionProgress * 1.7;

                transition81.style.opacity =
                    Math.min(
                        1,
                        transitionProgress * 2
                    );

                transition81.style.transform =
                    `scale(${numberScale})`;

            } else {

                transition.style.opacity = "0";

                transition.style.clipPath =
                    "circle(0% at 50% 50%)";

                transition81.style.opacity = "0";

            }


            /*
             * ------------------------------------------------
             * VIDEO MASK / RED TRANSFORMATION
             *
             * 52% → 82%
             * ------------------------------------------------
             */

            let redProgress =
                (progress - .52) / .30;

            redProgress =
                Math.max(
                    0,
                    Math.min(
                        1,
                        redProgress
                    )
                );


            /*
             * Video slowly disappears.
             */

            video.style.opacity =
                1 - redProgress;


            /*
             * Hero content changes to white/red layout.
             */

            const content =
                document.querySelector(".hero-content");

            if (redProgress > 0) {

                content.style.transform =
                    `translateY(${redProgress * -35
                    }px)`;

                content.style.opacity =
                    1 - redProgress * .15;

            } else {

                content.style.transform =
                    "translateY(0)";

                content.style.opacity = "1";

            }


            /*
             * ------------------------------------------------
             * FINAL HERO STATE
             *
             * 82% → 100%
             * ------------------------------------------------
             */

            if (progress > .80) {

                const finalProgress =
                    Math.min(
                        1,
                        (progress - .80) / .20
                    );

                transition.style.background =
                    `rgb(237,28,36)`;

                transition.style.clipPath =
                    `circle(${100 +
                    finalProgress * 30
                    }% at 50% 50%)`;

                transition81.style.transform =
                    `scale(${1.7 -
                    finalProgress * 1.62
                    })`;

                transition81.style.opacity =
                    1 - finalProgress;

            }


            /*
             * Hero video zoom
             */

            const videoScale =
                1.04 +
                progress * .08;

            video.style.transform =
                `scale(${videoScale})`;

        }


        $(window).on(
            "scroll",
            updateHero
        );

        updateHero();

    }
/* =====================================================
   PURPOSE SCROLL ANIMATION
===================================================== */

$(document).ready(function () {

    const $section =
        $("#purpose");

    const $orbit =
        $(".purpose-orbit");

    const $numbers =
        $(".purpose-number");


    if (!$section.length) {
        return;
    }


    let numbersAnimated = false;


    /* =================================================
       NUMBER COUNTER
    ================================================= */

    function animateNumbers() {

        if (numbersAnimated) {
            return;
        }

        numbersAnimated = true;


        $numbers.each(function () {

            const $number =
                $(this);

            const target =
                parseInt(
                    $number.attr(
                        "data-target"
                    ),
                    10
                );


            const suffix =
                $number.attr(
                    "data-suffix"
                ) || "";


            $({
                value: 0

            }).animate({

                value: target

            }, {

                duration: 1800,

                easing: "swing",

                step: function () {

                    $number.text(
                        Math.floor(
                            this.value
                        ) + suffix
                    );

                },

                complete: function () {

                    $number.text(
                        target + suffix
                    );

                }

            });

        });

    }


    /* =================================================
       RESET COUNTER
    ================================================= */

    function resetNumbers() {

        numbersAnimated = false;

        $numbers.each(function () {

            $(this).text("0");

        });

    }


    /* =================================================
       SCROLL
    ================================================= */

    function updatePurpose() {

        const section =
            $section[0];

        const rect =
            section.getBoundingClientRect();


        const sectionHeight =
            $section.outerHeight();

        const viewportHeight =
            $(window).height();


        const scrollDistance =
            sectionHeight -
            viewportHeight;


        if (scrollDistance <= 0) {
            return;
        }


        let progress =
            -rect.top /
            scrollDistance;


        progress =
            Math.max(
                0,
                Math.min(
                    1,
                    progress
                )
            );


        /* =============================================
           ORBIT SCALE
        ============================================= */

        const scale =
            0.75 +
            progress * 0.45;


        $orbit.css(
            "transform",
            `
            translate(-50%, -50%)
            scale(${scale})
            `
        );


        /* =============================================
           ADDITIONAL SCROLL ROTATION
        ============================================= */

        const rotation =
            progress * 100;


        $(".orbit-outer").css(
            "margin-left",
            `${Math.sin(progress * Math.PI * 2) * 10}px`
        );


        $(".orbit-middle").css(
            "margin-top",
            `${Math.cos(progress * Math.PI * 2) * 10}px`
        );


        $(".orbit-inner").css(
            "margin-left",
            `${Math.cos(progress * Math.PI * 2) * 8}px`
        );


        /* =============================================
           NUMBER ANIMATION
        ============================================= */

        if (progress > 0.12) {

            animateNumbers();

        }


        /* =============================================
           RESET WHEN COMPLETELY ABOVE
        ============================================= */

        if (progress <= 0) {

            resetNumbers();

        }

    }


    $(window).on(
        "scroll",
        updatePurpose
    );


    $(window).on(
        "resize",
        updatePurpose
    );


    updatePurpose();

});

  /* =====================================================
   JOURNEY SCROLL SLIDER
===================================================== */

const journeySection =
    document.querySelector(".journey-section");

const journeySlides =
    document.querySelectorAll(".journey-slide");

const journeyProgress =
    document.querySelector("#journeyProgress");

const journeyCurrent =
    document.querySelector("#journeyCurrent");


if (
    journeySection &&
    journeySlides.length
) {

    let currentSlide = -1;


    function updateJourney() {

        const rect =
            journeySection.getBoundingClientRect();


        const sectionHeight =
            journeySection.offsetHeight;


        const viewportHeight =
            window.innerHeight;


        /*
         * Total scroll distance
         * of Journey section.
         */

        const scrollDistance =
            sectionHeight -
            viewportHeight;


        /*
         * Current Journey progress.
         */

        let progress =
            -rect.top /
            scrollDistance;


        progress =
            Math.max(
                0,
                Math.min(
                    1,
                    progress
                )
            );


        /* =========================================
           PROGRESS BAR
        ========================================= */

        if (journeyProgress) {

            journeyProgress.style.width =
                `${progress * 100}%`;

        }


        /* =========================================
           SLIDE NUMBER
        ========================================= */

        const slideCount =
            journeySlides.length;


        const slideProgress =
            progress *
            slideCount;


        let slideIndex =
            Math.floor(slideProgress);


        /*
         * Prevent index overflow.
         */

        slideIndex =
            Math.min(
                slideIndex,
                slideCount - 1
            );


        /* =========================================
           CHANGE SLIDE
        ========================================= */

        if (
            slideIndex !== currentSlide
        ) {

            currentSlide =
                slideIndex;


            journeySlides.forEach(
                (slide, index) => {

                    slide.classList.toggle(
                        "active",
                        index === slideIndex
                    );

                }
            );


            if (journeyCurrent) {

                journeyCurrent.textContent =
                    String(
                        slideIndex + 1
                    ).padStart(2, "0");

            }

        }


        /* =========================================
           CONTINUOUS IMAGE MOVEMENT
        ========================================= */

        journeySlides.forEach(
            (slide, index) => {

                const distance =
                    slideIndex -
                    index;


                const image =
                    slide.querySelector(
                        ".journey-image-wrap"
                    );


                const info =
                    slide.querySelector(
                        ".journey-slide-info"
                    );


                if (image) {

                    const scale =
                        1 -
                        Math.min(
                            Math.abs(distance) * .08,
                            .12
                        );


                    const y =
                        distance * 70;


                    image.style.transform =
                        `
                        translate(
                            -50%,
                            calc(-50% + ${y}px)
                        )
                        scale(${scale})
                        `;

                }


                if (info) {

                    const x =
                        distance * 80;


                    const opacity =
                        Math.max(
                            0,
                            1 -
                            Math.abs(distance)
                        );


                    info.style.transform =
                        `translateX(${x}px)`;


                    info.style.opacity =
                        opacity;

                }

            }
        );

    }


    $(window).on(
        "scroll",
        updateJourney
    );


    $(window).on(
        "resize",
        updateJourney
    );


    updateJourney();

}

    /* =====================================================
       STORY TIMELINE
    ===================================================== */

    const storySection =
        document.querySelector(
            ".story-section"
        );

    const storyTimeline =
        document.querySelector(
            ".story-timeline"
        );


    if (storySection && storyTimeline) {

        function updateStoryTimeline() {

            const rect =
                storyTimeline.getBoundingClientRect();

            const timelineHeight =
                storyTimeline.offsetHeight;

            const viewportCenter =
                window.innerHeight * .5;


            /*
             * Position of viewport center
             * inside timeline.
             */

            let progress =
                (viewportCenter - rect.top)
                / timelineHeight;

            progress =
                Math.max(
                    0,
                    Math.min(1, progress)
                );


            const progressPercent =
                progress * 100;


            storyTimeline.style
                .setProperty(
                    "--story-progress",
                    `${progressPercent}%`
                );


            const dotY =
                progress *
                timelineHeight;


            storyTimeline.style
                .setProperty(
                    "--dot-y",
                    `${dotY}px`
                );


            /*
             * Story item visibility.
             */

            $(".story-item").each(
                function (index) {

                    const itemRect =
                        this.getBoundingClientRect();

                    const itemCenter =
                        itemRect.top +
                        itemRect.height / 2;


                    const visible =
                        itemRect.top <
                        window.innerHeight * .85 &&
                        itemRect.bottom >
                        window.innerHeight * .15;


                    if (visible) {

                        $(this)
                            .addClass("is-visible");

                    } else {

                        $(this)
                            .removeClass("is-visible");

                    }


                    /*
                     * Current milestone.
                     */

                    const distance =
                        Math.abs(
                            itemCenter -
                            viewportCenter
                        );

                    if (distance < 220) {

                        $(".story-item")
                            .removeClass("is-current");

                        $(this)
                            .addClass("is-current");

                    }

                }
            );

        }


        $(window).on(
            "scroll",
            updateStoryTimeline
        );

        updateStoryTimeline();

    }


    /* =====================================================
       IMPACT SCROLL SLIDER
    ===================================================== */

    const impact =
        document.querySelector(
            ".impact-section"
        );


    if (impact) {

        function updateImpact() {

            const rect =
                impact.getBoundingClientRect();

            const scrollRange =
                impact.offsetHeight -
                window.innerHeight;

            let progress =
                -rect.top / scrollRange;

            progress =
                Math.max(
                    0,
                    Math.min(1, progress)
                );


            const slides =
                $(".impact-slide");

            const markers =
                $(".impact-progress span");

            const slideCount =
                slides.length;


            let index =
                Math.floor(
                    progress *
                    slideCount
                );


            if (index >= slideCount) {
                index = slideCount - 1;
            }


            slides.removeClass("active");
            markers.removeClass("active");

            slides.eq(index)
                .addClass("active");

            markers.eq(index)
                .addClass("active");

        }


        $(window).on(
            "scroll",
            updateImpact
        );

        updateImpact();

    }

    /* =====================================================
       VALUES SCROLL ANIMATION
    ===================================================== */

    const valuesSection = document.querySelector(".values-section");
    const valuesGrid = document.querySelector(".values-grid");

    if (valuesSection && valuesGrid) {

        function updateValues() {

            const rect = valuesSection.getBoundingClientRect();

            const sectionHeight = valuesSection.offsetHeight;
            const viewportHeight = window.innerHeight;

            /*
             * How much of the Values section
             * has already passed through the viewport.
             */
            const scrollDistance = sectionHeight - viewportHeight;

            let progress = -rect.top / scrollDistance;

            progress = Math.max(0, Math.min(1, progress));


            /* =================================================
               SECTION ENTERING
            ================================================= */

            if (progress < 0.08) {

                valuesGrid.classList.remove("cards-active");
                valuesGrid.classList.remove("cards-out");

            }


            /* =================================================
               VALUES SECTION ACTIVE
               
               Cards stay in their normal position.
            ================================================= */

            else if (progress < 0.88) {

                valuesGrid.classList.add("cards-active");
                valuesGrid.classList.remove("cards-out");

            }


            /* =================================================
               VALUES SECTION LEAVING
    
               ONLY near the END of the section.
            ================================================= */

            else {

                valuesGrid.classList.add("cards-active");
                valuesGrid.classList.add("cards-out");

            }

        }


        $(window).on("scroll", updateValues);

        $(window).on("resize", updateValues);

        updateValues();

    }


    /* =====================================================
       PARTICLE 81
    ===================================================== */

    const canvas =
        document.getElementById(
            "particleCanvas"
        );


    if (canvas) {

        const ctx =
            canvas.getContext("2d");

        let particles = [];

        let targets = [];

        let pointer = {
            x: -1000,
            y: -1000,
            active: false
        };


        /*
         * Resize canvas.
         */

        function resizeCanvas() {

            const rect =
                canvas.getBoundingClientRect();

            const ratio =
                window.devicePixelRatio || 1;

            canvas.width =
                rect.width * ratio;

            canvas.height =
                rect.height * ratio;

            ctx.setTransform(
                ratio,
                0,
                0,
                ratio,
                0,
                0
            );

            createParticleTargets();

        }


        /*
         * Create 81 target positions.
         */

        function createParticleTargets() {

            const rect =
                canvas.getBoundingClientRect();

            const width =
                rect.width;

            const height =
                rect.height;


            /*
             * Offscreen canvas.
             */

            const offscreen =
                document.createElement(
                    "canvas"
                );

            offscreen.width =
                width;

            offscreen.height =
                height;


            const offCtx =
                offscreen.getContext(
                    "2d"
                );


            const fontSize =
                Math.min(
                    width * .72,
                    520
                );


            offCtx.fillStyle =
                "#ffffff";

            offCtx.font =
                `900 ${fontSize}px "Space Grotesk", Arial`;

            offCtx.textAlign =
                "center";

            offCtx.textBaseline =
                "middle";


            offCtx.fillText(
                "81",
                width / 2,
                height / 2
            );


            const imageData =
                offCtx.getImageData(
                    0,
                    0,
                    width,
                    height
                );


            const data =
                imageData.data;


            const newTargets = [];


            const gap =
                width < 600
                    ? 5
                    : 6;


            for (
                let y = 0;
                y < height;
                y += gap
            ) {

                for (
                    let x = 0;
                    x < width;
                    x += gap
                ) {

                    const index =
                        (y * width + x)
                        * 4;


                    if (
                        data[index + 3]
                        > 100
                    ) {

                        newTargets.push({
                            x: x,
                            y: y
                        });

                    }

                }

            }


            /*
             * Limit particles.
             */

            const maxParticles =
                width < 600
                    ? 550
                    : 1000;


            targets =
                newTargets
                    .sort(
                        () => Math.random() - .5
                    )
                    .slice(
                        0,
                        maxParticles
                    );


            /*
             * Create particles.
             */

            particles = targets.map(
                function (target, index) {

                    return {

                        x:
                            Math.random()
                            * width,

                        y:
                            Math.random()
                            * height,

                        vx: 0,
                        vy: 0,

                        tx: target.x,
                        ty: target.y,

                        size:
                            Math.random() *
                            1.6 + .7,

                        red:
                            index % 8 === 0

                    };

                }
            );

        }


        /*
         * Pointer position.
         */

        function updatePointer(
            clientX,
            clientY
        ) {

            const rect =
                canvas.getBoundingClientRect();

            pointer.x =
                clientX - rect.left;

            pointer.y =
                clientY - rect.top;

            pointer.active = true;

        }


        canvas.addEventListener(
            "mousemove",
            function (event) {

                updatePointer(
                    event.clientX,
                    event.clientY
                );

            }
        );


        canvas.addEventListener(
            "mouseleave",
            function () {

                pointer.active = false;

                pointer.x = -1000;
                pointer.y = -1000;

            }
        );


        canvas.addEventListener(
            "touchmove",
            function (event) {

                if (
                    event.touches.length
                ) {

                    updatePointer(
                        event.touches[0].clientX,
                        event.touches[0].clientY
                    );

                }

            },
            {
                passive: true
            }
        );


        canvas.addEventListener(
            "touchend",
            function () {

                pointer.active = false;

            }
        );


        /*
         * Animation.
         */

        function animateParticles() {

            const rect =
                canvas.getBoundingClientRect();

            const width =
                rect.width;

            const height =
                rect.height;


            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            particles.forEach(
                function (particle) {


                    /*
                     * Spring toward target.
                     */

                    let dx =
                        particle.tx -
                        particle.x;

                    let dy =
                        particle.ty -
                        particle.y;


                    particle.vx +=
                        dx * .012;

                    particle.vy +=
                        dy * .012;


                    /*
                     * Pointer repulsion.
                     */

                    if (pointer.active) {

                        const px =
                            particle.x -
                            pointer.x;

                        const py =
                            particle.y -
                            pointer.y;

                        const distance =
                            Math.sqrt(
                                px * px +
                                py * py
                            );

                        const radius =
                            130;


                        if (
                            distance < radius
                        ) {

                            const force =
                                (radius -
                                    distance)
                                / radius;


                            particle.vx +=
                                (px /
                                    (distance || 1))
                                * force
                                * 2.5;

                            particle.vy +=
                                (py /
                                    (distance || 1))
                                * force
                                * 2.5;

                        }

                    }


                    /*
                     * Friction.
                     */

                    particle.vx *= .87;
                    particle.vy *= .87;


                    particle.x +=
                        particle.vx;

                    particle.y +=
                        particle.vy;


                    /*
                     * Draw.
                     */

                    ctx.beginPath();

                    ctx.arc(
                        particle.x,
                        particle.y,
                        particle.size,
                        0,
                        Math.PI * 2
                    );

                    ctx.fillStyle =
                        particle.red
                            ? "#ed1c24"
                            : "#ffffff";

                    ctx.globalAlpha = .8;

                    ctx.fill();

                }
            );


            ctx.globalAlpha = 1;


            requestAnimationFrame(
                animateParticles
            );

        }


        window.addEventListener(
            "resize",
            resizeCanvas
        );


        resizeCanvas();

        animateParticles();

    }


    /* =====================================================
       SMOOTH ANCHOR LINKS
    ===================================================== */

    $("a[href^='#']").on(
        "click",
        function (event) {

            const target =
                $(this).attr("href");

            if (
                target &&
                target !== "#"
            ) {

                const element =
                    $(target);

                if (element.length) {

                    event.preventDefault();

                    $("html, body").animate(
                        {
                            scrollTop:
                                element.offset().top
                        },
                        900
                    );

                }

            }

        }
    );


    /* =====================================================
       HERO VIDEO FALLBACK
    ===================================================== */

    const heroVideo =
        document.querySelector(
            ".hero-video"
        );


    if (heroVideo) {

        heroVideo.play().catch(
            function () {

                /*
                 * Browser may block autoplay.
                 * The video is muted, so normally
                 * autoplay should work.
                 */

                console.log(
                    "Video autoplay was blocked."
                );

            }
        );

    }


    /* =====================================================
   FUTURE / TOGETHER PARTICLE 81
===================================================== */

    const futureSection =
        document.querySelector(".future-section");

    const futureCanvas =
        document.querySelector("#futureParticles");


    if (futureSection && futureCanvas) {

        const ctx =
            futureCanvas.getContext("2d");

        let width = 0;
        let height = 0;

        let particles = [];

        let targetPoints = [];

        let animationStarted = false;

        let sectionVisible = false;


        /* =================================================
           POINTER
        ================================================= */

        const pointer = {

            x: -9999,

            y: -9999,

            active: false

        };


        /* =================================================
           CONFIG
        ================================================= */

        const config = {

            particleSize: 1.2,

            gap: 4,

            mouseRadius: 130,

            mouseForce: 9,

            returnSpeed: 0.075,

            assembleSpeed: 0.045

        };


        /* =================================================
           RESIZE CANVAS
        ================================================= */

        function resizeCanvas() {

            const rect =
                futureCanvas.getBoundingClientRect();

            width = rect.width;
            height = rect.height;


            const dpr =
                Math.min(window.devicePixelRatio || 1, 2);


            futureCanvas.width =
                width * dpr;

            futureCanvas.height =
                height * dpr;


            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );


            create81();

        }


      
        /* =================================================
        CREATE BIG 81
        ================================================= */

        function create81() {

            targetPoints = [];

            const textCanvas =
                document.createElement("canvas");

            const textCtx =
                textCanvas.getContext("2d");


            textCanvas.width = Math.floor(width);

            textCanvas.height = Math.floor(height);


            textCtx.clearRect(
                0,
                0,
                textCanvas.width,
                textCanvas.height
            );


            /*
            * BIG 81
            *
            * Make the number occupy
            * most of the right side.
            */

            const fontSize =
                Math.min(
                    width * 0.82,
                    height * 0.72,
                    650
                );


            textCtx.font =
                `900 ${fontSize}px Arial Black, Arial, sans-serif`;


            textCtx.textAlign = "center";

            textCtx.textBaseline = "middle";

            textCtx.fillStyle = "#ac0404";


            /*
            * Slightly lower position
            * gives better visual balance.
            */

            textCtx.fillText(
                "81",
                textCanvas.width / 2,
                textCanvas.height / 2
            );


            /*
            * Read pixels
            */

            const imageData =
                textCtx.getImageData(
                    0,
                    0,
                    textCanvas.width,
                    textCanvas.height
                );


            /*
            * Convert pixels into particles
            */

            for (
                let y = 0;
                y < textCanvas.height;
                y += config.gap
            ) {

                for (
                    let x = 0;
                    x < textCanvas.width;
                    x += config.gap
                ) {

                    const index =
                        (
                            y *
                            textCanvas.width +
                            x
                        ) * 4;


                    const alpha =
                        imageData.data[index + 3];


                    if (alpha > 80) {

                        targetPoints.push({

                            x: x,

                            y: y

                        });

                    }

                }

            }


            console.log(
                "81 particles:",
                targetPoints.length
            );


            createParticles();

        }


        /* =================================================
           CREATE PARTICLES
        ================================================= */

        function createParticles() {

            particles = [];


            targetPoints.forEach(
                (point, index) => {

                    /*
                     * Start particles scattered
                     * around the screen.
                     */

                    const angle =
                        Math.random() *
                        Math.PI *
                        2;


                    const distance =
                        Math.max(width, height) *
                        (0.3 + Math.random() * 0.7);


                    particles.push({

                        x:
                            width / 2 +
                            Math.cos(angle) *
                            distance,

                        y:
                            height / 2 +
                            Math.sin(angle) *
                            distance,

                        vx: 0,

                        vy: 0,

                        targetX: point.x,

                        targetY: point.y,

                        size:
                            config.particleSize *
                            (.7 + Math.random() * .8),

                        alpha:
                            .35 +
                            Math.random() * .65,

                        delay:
                            Math.random() *
                            500

                    });

                }
            );

        }


        /* =================================================
           ANIMATE
        ================================================= */

        function animate() {

            requestAnimationFrame(animate);


            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            particles.forEach(
                particle => {


                    /* =====================================
                       ASSEMBLE 81
                    ===================================== */

                    if (animationStarted) {

                        const dx =
                            particle.targetX -
                            particle.x;

                        const dy =
                            particle.targetY -
                            particle.y;


                        particle.vx +=
                            dx *
                            config.assembleSpeed;

                        particle.vy +=
                            dy *
                            config.assembleSpeed;

                    }


                    /* =====================================
                       POINTER REPULSION
                    ===================================== */

                    if (pointer.active) {

                        const dx =
                            particle.x -
                            pointer.x;

                        const dy =
                            particle.y -
                            pointer.y;


                        const distance =
                            Math.sqrt(
                                dx * dx +
                                dy * dy
                            );


                        if (
                            distance <
                            config.mouseRadius
                        ) {

                            /*
                             * Prevent divide by zero
                             */

                            const safeDistance =
                                Math.max(
                                    distance,
                                    1
                                );


                            const force =
                                (
                                    1 -
                                    safeDistance /
                                    config.mouseRadius
                                ) *
                                config.mouseForce;


                            particle.vx +=
                                (
                                    dx /
                                    safeDistance
                                ) *
                                force;


                            particle.vy +=
                                (
                                    dy /
                                    safeDistance
                                ) *
                                force;

                        }

                    }


                    /* =====================================
                       FRICTION
                    ===================================== */

                    particle.vx *= .82;

                    particle.vy *= .82;


                    /* =====================================
                       MOVE
                    ===================================== */

                    particle.x +=
                        particle.vx;

                    particle.y +=
                        particle.vy;


                    /* =====================================
                       DRAW
                    ===================================== */

                    ctx.beginPath();

ctx.arc(
    particle.x,
    particle.y,
    particle.size,
    0,
    Math.PI * 2
);

ctx.fillStyle =
    `rgba(237,28,36,${particle.alpha})`;

ctx.fill();

                }
            );

        }


        /* =================================================
           MOUSE MOVE
        ================================================= */

        futureCanvas.addEventListener(
            "mousemove",
            function (event) {

                const rect =
                    futureCanvas.getBoundingClientRect();


                pointer.x =
                    event.clientX -
                    rect.left;


                pointer.y =
                    event.clientY -
                    rect.top;


                pointer.active = true;

            }
        );


        /* =================================================
           MOUSE LEAVE
        ================================================= */

        futureCanvas.addEventListener(
            "mouseleave",
            function () {

                pointer.active = false;

                pointer.x = -9999;

                pointer.y = -9999;

            }
        );


        /* =================================================
           TOUCH START
        ================================================= */

        futureCanvas.addEventListener(
            "touchstart",
            function (event) {

                event.preventDefault();

                const touch =
                    event.touches[0];


                const rect =
                    futureCanvas.getBoundingClientRect();


                pointer.x =
                    touch.clientX -
                    rect.left;


                pointer.y =
                    touch.clientY -
                    rect.top;


                pointer.active = true;

            },
            {
                passive: false
            }
        );


        /* =================================================
           TOUCH MOVE
        ================================================= */

        futureCanvas.addEventListener(
            "touchmove",
            function (event) {

                event.preventDefault();

                const touch =
                    event.touches[0];


                const rect =
                    futureCanvas.getBoundingClientRect();


                pointer.x =
                    touch.clientX -
                    rect.left;


                pointer.y =
                    touch.clientY -
                    rect.top;


                pointer.active = true;

            },
            {
                passive: false
            }
        );


        /* =================================================
           TOUCH END
        ================================================= */

        futureCanvas.addEventListener(
            "touchend",
            function () {

                pointer.active = false;

                pointer.x = -9999;

                pointer.y = -9999;

            }
        );


        /* =================================================
           SCROLL DETECTION
        ================================================= */

        function checkFutureSection() {

            const rect =
                futureSection.getBoundingClientRect();


            const viewport =
                window.innerHeight;


            /*
             * Percentage of the section
             * visible inside viewport.
             */

            const visible =
                Math.min(
                    rect.bottom,
                    viewport
                ) -
                Math.max(
                    rect.top,
                    0
                );


            const visibility =
                visible / viewport;


            /*
             * Start particle formation
             * when section enters screen.
             */

            if (
                visibility > 0.15 &&
                !sectionVisible
            ) {

                sectionVisible = true;

                animationStarted = true;

            }


            /*
             * Section completely left screen.
             */

            if (
                visibility <= 0
            ) {

                sectionVisible = false;

                animationStarted = false;

                pointer.active = false;

            }

        }


        /* =================================================
           EVENTS
        ================================================= */

        $(window).on(
            "scroll",
            checkFutureSection
        );


        $(window).on(
            "resize",
            resizeCanvas
        );


        /* =================================================
           START
        ================================================= */

        resizeCanvas();

        checkFutureSection();

        animate();

    }


});