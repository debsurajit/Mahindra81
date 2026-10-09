/* =========================================================
   MAHINDRA 81
   IMMERSIVE WEBGL EXPERIENCE
========================================================= */


/* =========================================================
   GLOBAL
========================================================= */

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   LENIS
========================================================= */

const lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 0.85
});


lenis.on("scroll", ScrollTrigger.update);


gsap.ticker.add(function (time) {

    lenis.raf(time * 1000);

});


gsap.ticker.lagSmoothing(0);


/* =========================================================
   DOM
========================================================= */

const loader =
    document.getElementById("loader");

const loaderPercent =
    document.getElementById("loaderPercent");

const loaderBar =
    document.getElementById("loaderBar");

const loaderNumber =
    document.querySelector(".loader-number");

const counter =
    document.getElementById("counterCurrent");

const menuButton =
    document.getElementById("menuButton");

const menuOverlay =
    document.getElementById("menuOverlay");


/* =========================================================
   LOADER
========================================================= */

let loaderProgress = 0;

function updateLoader(value) {

    loaderProgress =
        Math.min(100, value);

    if (loaderPercent) {

        loaderPercent.textContent =
            Math.floor(loaderProgress) + "%";

    }

    if (loaderBar) {

        loaderBar.style.width =
            loaderProgress + "%";

    }

    if (loaderNumber) {

        loaderNumber.style.setProperty(
            "--loader-fill",
            loaderProgress + "%"
        );

    }

}


function finishLoader() {

    updateLoader(100);

    setTimeout(function () {

        if (loader) {

            loader.classList.add("hide");

        }

        startExperience();

    }, 500);

}


function runLoader() {

    let current = 0;

    const timer =
        setInterval(function () {

            current +=
                Math.random() * 5;

            if (current >= 100) {

                clearInterval(timer);

                finishLoader();

                return;

            }

            updateLoader(current);

        }, 45);

}


runLoader();


/* =========================================================
   THREE VARIABLES
========================================================= */

let scene;
let camera;
let renderer;

let clock;

let heroMesh;
let heroMaterial;

let particleSystem;

let worldGroup;

let mouseX = 0;
let mouseY = 0;

let targetMouseX = 0;
let targetMouseY = 0;

let scrollVelocity = 0;

let currentWorld = 0;


/* =========================================================
   TEXTURES
========================================================= */

const textureLoader =
    new THREE.TextureLoader();


const textureUrls = {

    hero:
        "https://www.mahindra.com/sites/default/files/2026-07/Mahindra%20rise%20banner%20update%20Home%20Page%20Hero%20Main%20Banner%20Adapt%201903x841%20without%20copy.jpg.webp",

    automotive:
        "https://www.mahindra.com/sites/default/files/2026-03/Mahindra_What%20We%20Do-Automotive_.webp",

    farm:
        "https://www.mahindra.com/sites/default/files/2026-03/Mahindra_What%20We%20Do-Farming_%20%281%29.webp",

    technology:
        "https://www.mahindra.com/sites/default/files/2026-03/Mahindra_What%20We%20Do-Technology%20Services.webp",

    hospitality:
        "https://www.mahindra.com/sites/default/files/2026-03/Mahindra_What%20We%20Do%203.webp",

    logistics:
        "https://www.mahindra.com/sites/default/files/2026-03/Mahindra_What%20We%20Do-Logistics%20Services.webp",

    renewable:
        "https://www.mahindra.com/sites/default/files/2026-03/Mahindra_What%20We%20Do-Renewable%20Services.webp",

    earthshot:
        "https://www.mahindra.com/sites/default/files/2026-09/Earthshot%20Finalist%20Main%20Banner%20Adapt%201903x841%20without%20copy.webp"

};


const textures = {};


/* =========================================================
   SHADERS
========================================================= */

const imageVertexShader = `

uniform float uTime;

uniform float uScroll;

uniform vec2 uMouse;

varying vec2 vUv;

void main() {

    vUv = uv;

    vec3 pos = position;

    float wave =
        sin(
            uv.y * 5.0 +
            uTime * 0.8
        );

    pos.z +=
        wave *
        0.08;

    pos.x +=
        uMouse.x *
        sin(uv.y * 3.14159) *
        0.12;

    pos.y +=
        uMouse.y *
        sin(uv.x * 3.14159) *
        0.12;

    pos.z +=
        uScroll *
        0.15;

    gl_Position =
        projectionMatrix *
        modelViewMatrix *
        vec4(pos,1.0);

}
`;


const imageFragmentShader = `

uniform sampler2D uTexture;

uniform float uTime;

uniform float uProgress;

uniform vec2 uMouse;

varying vec2 vUv;

void main() {

    vec2 uv = vUv;

    float distortion =
        sin(
            uv.y * 12.0 +
            uTime * 1.2
        )
        *
        0.012
        *
        uProgress;

    uv.x += distortion;

    float mouse =
        distance(
            uv,
            vec2(
                0.5 +
                uMouse.x * 0.15,

                0.5 +
                uMouse.y * 0.15
            )
        );

    uv.x +=
        sin(mouse * 20.0)
        *
        0.008
        *
        (1.0 - mouse);

    vec4 color =
        texture2D(
            uTexture,
            uv
        );

    float vignette =
        smoothstep(
            0.9,
            0.15,
            distance(
                uv,
                vec2(0.5)
            )
        );

    color.rgb *=
        vignette;

    gl_FragColor =
        color;

}
`;


/* =========================================================
   INIT THREE
========================================================= */

function initThree() {

    const canvas =
        document.getElementById("webgl");

    if (!canvas) {

        console.error(
            "Canvas #webgl not found."
        );

        return;

    }


    scene =
        new THREE.Scene();


    camera =
        new THREE.PerspectiveCamera(
            45,
            window.innerWidth /
            window.innerHeight,
            0.1,
            100
        );


    camera.position.set(
        0,
        0,
        8
    );


    renderer =
        new THREE.WebGLRenderer({

            canvas: canvas,

            antialias: true,

            alpha: true,

            powerPreference:
                "high-performance"

        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    clock =
        new THREE.Clock();


    worldGroup =
        new THREE.Group();


    scene.add(
        worldGroup
    );


    createParticles();


    loadMainTextures();


    animateThree();

}


/* =========================================================
   LOAD TEXTURES
========================================================= */

function loadMainTextures() {

    const entries =
        Object.entries(
            textureUrls
        );


    let loaded = 0;


    entries.forEach(
        function ([name, url]) {

            textureLoader.load(

                url,

                function (texture) {

                    texture.colorSpace =
                        THREE.SRGBColorSpace;

                    textures[name] =
                        texture;

                    loaded++;

                    const percent =
                        20 +
                        (
                            loaded /
                            entries.length
                        ) *
                        70;

                    updateLoader(
                        percent
                    );

                    if (
                        name === "hero" &&
                        !heroMesh
                    ) {

                        createHeroMesh(
                            texture
                        );

                    }

                    if (
                        loaded ===
                        entries.length
                    ) {

                        updateLoader(100);

                    }

                },

                undefined,

                function (error) {

                    console.warn(
                        "Texture failed:",
                        name,
                        error
                    );

                }

            );

        }
    );

}


/* =========================================================
   HERO WEBGL MESH
========================================================= */

function createHeroMesh(texture) {

    const geometry =
        new THREE.PlaneGeometry(
            12,
            7,
            100,
            100
        );


    heroMaterial =
        new THREE.ShaderMaterial({

            uniforms: {

                uTexture: {
                    value: texture
                },

                uTime: {
                    value: 0
                },

                uScroll: {
                    value: 0
                },

                uProgress: {
                    value: 0
                },

                uMouse: {
                    value:
                        new THREE.Vector2(
                            0,
                            0
                        )
                }

            },

            vertexShader:
                imageVertexShader,

            fragmentShader:
                imageFragmentShader,

            transparent: true

        });


    heroMesh =
        new THREE.Mesh(
            geometry,
            heroMaterial
        );


    heroMesh.position.z =
        -2;


    worldGroup.add(
        heroMesh
    );

}


/* =========================================================
   PARTICLES
========================================================= */

function createParticles() {

    const count = 18800;

    const positions =
        new Float32Array(
            count * 3
        );

    const sizes =
        new Float32Array(
            count
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const i3 =
            i * 3;


        positions[i3] =
            (Math.random() - .5) *
            20;


        positions[i3 + 1] =
            (Math.random() - .5) *
            14;


        positions[i3 + 2] =
            (Math.random() - .5) *
            18;


        sizes[i] =
            Math.random() * 2;

    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    geometry.setAttribute(
        "aSize",
        new THREE.BufferAttribute(
            sizes,
            1
        )
    );


    const material =
        new THREE.PointsMaterial({

            color:
                new THREE.Color(
                    0xffffff
                ),

            size: 0.018,

            transparent: true,

            opacity: .45,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending

        });


    particleSystem =
        new THREE.Points(
            geometry,
            material
        );


    scene.add(
        particleSystem
    );

}


/* =========================================================
   THREE ANIMATION
========================================================= */

function animateThree() {

    requestAnimationFrame(
        animateThree
    );


    if (!renderer) {
        return;
    }


    const time =
        clock.getElapsedTime();


    mouseX =
        THREE.MathUtils.lerp(
            mouseX,
            targetMouseX,
            .035
        );


    mouseY =
        THREE.MathUtils.lerp(
            mouseY,
            targetMouseY,
            .035
        );


    if (heroMaterial) {

        heroMaterial.uniforms
            .uTime.value =
            time;

        heroMaterial.uniforms
            .uScroll.value =
            scrollVelocity;

        heroMaterial.uniforms
            .uMouse.value.set(
                mouseX,
                mouseY
            );

    }


    if (particleSystem) {

        particleSystem.rotation.y =
            time * .015 +
            mouseX * .08;

        particleSystem.rotation.x =
            mouseY * .05;

    }


    if (worldGroup) {

        worldGroup.rotation.y =
            mouseX * .025;

        worldGroup.rotation.x =
            mouseY * .018;

    }


    renderer.render(
        scene,
        camera
    );

}


/* =========================================================
   MOUSE
========================================================= */

window.addEventListener(
    "mousemove",
    function (event) {

        targetMouseX =
            (
                event.clientX /
                window.innerWidth -
                .5
            ) * 2;


        targetMouseY =
            -(
                event.clientY /
                window.innerHeight -
                .5
            ) * 2;

    }
);


/* =========================================================
   SCROLL VELOCITY
========================================================= */

let previousScroll =
    window.scrollY;


window.addEventListener(
    "scroll",
    function () {

        const current =
            window.scrollY;

        scrollVelocity =
            (
                current -
                previousScroll
            ) * .0015;

        previousScroll =
            current;

    },
    {
        passive: true
    }
);


/* =========================================================
   HERO CAMERA
========================================================= */

function heroScene() {

    const section =
        document.querySelector(
            ".hero-world"
        );


    if (!section) {
        return;
    }


    const timeline =
        gsap.timeline({

            scrollTrigger: {

                trigger: section,

                start: "top top",

                end: "bottom top",

                scrub: 1,

                onUpdate:
                    function (self) {

                        if (
                            heroMaterial
                        ) {

                            heroMaterial
                                .uniforms
                                .uProgress
                                .value =
                                self.progress;

                        }

                    }

            }

        });


    timeline.to(

        camera.position,

        {

            z: 5,

            y: -.3,

            ease: "none"

        },

        0

    );


    if (heroMesh) {

        timeline.to(

            heroMesh.position,

            {

                z: 1.5,

                x: -.5,

                rotationY: -.08,

                ease: "none"

            },

            0

        );

    }


    timeline.to(

        ".hero-content",

        {

            yPercent: -80,

            scale: .72,

            opacity: .15,

            ease: "none"

        },

        0

    );


    timeline.to(

        ".hero-side",

        {

            x: 100,

            opacity: 0,

            ease: "none"

        },

        0

    );

}


/* =========================================================
   PURPOSE WORLD
========================================================= */

function purposeScene() {

    const section =
        document.querySelector(
            ".purpose-world"
        );


    if (!section) {
        return;
    }


    const rings =
        gsap.utils.toArray(
            ".purpose-ring"
        );


    const timeline =
        gsap.timeline({

            scrollTrigger: {

                trigger: section,

                start: "top bottom",

                end: "bottom top",

                scrub: 1

            }

        });


    timeline.fromTo(

        ".purpose-content",

        {

            scale: .55,

            opacity: 0,

            y: 200

        },

        {

            scale: 1,

            opacity: 1,

            y: 0

        },

        0

    );


    rings.forEach(
        function (ring, index) {

            timeline.fromTo(

                ring,

                {

                    scale: .5,

                    rotation:
                        index * 30

                },

                {

                    scale:
                        1.4 +
                        index * .2,

                    rotation:
                        180 +
                        index * 90,

                    ease: "none"

                },

                0

            );

        }
    );


    timeline.to(

        ".purpose-content",

        {

            scale: 1.35,

            opacity: 0,

            y: -250

        }

    );

}


/* =========================================================
   HISTORY SCENE
========================================================= */

function historyScene() {

    const section =
        document.querySelector(
            ".history-world"
        );


    const track =
        document.querySelector(
            ".history-track"
        );


    if (!section || !track) {
        return;
    }


    const items =
        gsap.utils.toArray(
            ".history-item"
        );


    const line =
        document.querySelector(
            ".history-line::after"
        );


    gsap.to(

        track,

        {

            x: function () {

                return -(
                    track.scrollWidth -
                    window.innerWidth
                );

            },

            ease: "none",

            scrollTrigger: {

                trigger: section,

                start: "top top",

                end: "bottom bottom",

                scrub: 1,

                pin: true,

                invalidateOnRefresh: true

            }

        }

    );


    items.forEach(
        function (item, index) {

            gsap.fromTo(

                item,

                {

                    opacity: .2,

                    scale: .7,

                    z: -200

                },

                {

                    opacity: 1,

                    scale: 1,

                    z: 0,

                    scrollTrigger: {

                        trigger: item,

                        containerAnimation: undefined,

                        start: "left center",

                        end: "center center",

                        scrub: true

                    }

                }

            );

        }
    );


    gsap.to(

        ".history-line",

        {

            backgroundColor:
                "rgba(255,255,255,.4)",

            scrollTrigger: {

                trigger: section,

                start: "top top",

                end: "bottom bottom",

                scrub: 1

            }

        }

    );

}


/* =========================================================
   NUMBERS SCENE
========================================================= */

function numbersScene() {

    const section =
        document.querySelector(
            ".numbers-world"
        );


    if (!section) {
        return;
    }


    const numbers =
        gsap.utils.toArray(
            ".big-number"
        );


    const timeline =
        gsap.timeline({

            scrollTrigger: {

                trigger: section,

                start: "top top",

                end: "bottom bottom",

                scrub: 1,

                pin: true

            }

        });


    numbers.forEach(
        function (number, index) {

            timeline.fromTo(

                number,

                {

                    opacity: 0,

                    scale: .4,

                    z: -500,

                    rotationY:
                        index === 1
                            ? 30
                            : -30

                },

                {

                    opacity: 1,

                    scale: 1,

                    z: 0,

                    rotationY: 0,

                    duration: 1

                }

            );


            timeline.to(

                number,

                {

                    opacity: 0,

                    scale: 1.7,

                    z: 300,

                    duration: .7

                }

            );

        }
    );

}


/* =========================================================
   BUSINESS SCENE
========================================================= */

function businessScene() {

    const section =
        document.querySelector(
            ".business-world"
        );


    const orbit =
        document.getElementById(
            "businessOrbit"
        );


    if (!section || !orbit) {
        return;
    }


    const cards =
        gsap.utils.toArray(
            ".business-card"
        );


    gsap.to(

        orbit,

        {

            x: function () {

                return -(
                    orbit.scrollWidth -
                    window.innerWidth +
                    window.innerWidth * .1
                );

            },

            ease: "none",

            scrollTrigger: {

                trigger: section,

                start: "top top",

                end: "bottom bottom",

                scrub: 1,

                pin: true,

                invalidateOnRefresh: true,

                onUpdate:
                    function (self) {

                        const progress =
                            self.progress;

                        const bar =
                            document.querySelector(
                                ".business-progress span"
                            );

                        if (bar) {

                            bar.style.width =
                                (
                                    progress *
                                    100
                                ) + "%";

                        }

                    }

            }

        }

    );


    cards.forEach(
        function (card, index) {

            card.addEventListener(
                "mouseenter",
                function () {

                    gsap.to(
                        card,
                        {

                            rotationY: -5,

                            rotationX: 3,

                            scale: 1.025,

                            duration: .7,

                            ease: "power3.out"

                        }
                    );

                }
            );


            card.addEventListener(
                "mouseleave",
                function () {

                    gsap.to(
                        card,
                        {

                            rotationY: 0,

                            rotationX: 0,

                            scale: 1,

                            duration: .8,

                            ease: "power3.out"

                        }
                    );

                }
            );

        }
    );

}


/* =========================================================
   PILLARS SCENE
========================================================= */

function pillarsScene() {

    const section =
        document.querySelector(
            ".pillars-world"
        );


    const pillars =
        gsap.utils.toArray(
            ".pillar"
        );


    if (!section || !pillars.length) {
        return;
    }


    const timeline =
        gsap.timeline({

            scrollTrigger: {

                trigger: section,

                start: "top top",

                end: "bottom bottom",

                scrub: 1,

                pin: true

            }

        });


    pillars.forEach(
        function (pillar, index) {

            timeline.fromTo(

                pillar,

                {

                    opacity: 0,

                    x:
                        index % 2 === 0
                            ? 300
                            : -300,

                    scale: .55,

                    rotationY:
                        index % 2 === 0
                            ? -25
                            : 25

                },

                {

                    opacity: 1,

                    x: 0,

                    scale: 1,

                    rotationY: 0,

                    duration: 1

                }

            );


            timeline.to(

                pillar,

                {

                    opacity: 0,

                    x:
                        index % 2 === 0
                            ? -350
                            : 350,

                    scale: 1.25,

                    duration: .8

                }

            );

        }
    );

}


/* =========================================================
   IMPACT SCENE
========================================================= */

function impactScene() {

    const section =
        document.querySelector(
            ".impact-world"
        );


    if (!section) {
        return;
    }


    const timeline =
        gsap.timeline({

            scrollTrigger: {

                trigger: section,

                start: "top bottom",

                end: "bottom top",

                scrub: 1

            }

        });


    timeline.fromTo(

        ".impact-left",

        {

            x: -300,

            opacity: 0,

            scale: .7

        },

        {

            x: 0,

            opacity: 1,

            scale: 1

        }

    );


    timeline.fromTo(

        ".impact-orbit",

        {

            scale: .4,

            rotation: -35,

            opacity: 0

        },

        {

            scale: 1,

            rotation: 0,

            opacity: 1

        },

        0

    );


    timeline.to(

        ".impact-orbit",

        {

            scale: 1.5,

            rotation: 90,

            opacity: .3

        }

    );


    timeline.to(

        ".impact-left",

        {

            x: -300,

            scale: 1.25,

            opacity: 0

        },

        "<"

    );

}


/* =========================================================
   FUTURE SCENE
========================================================= */

function futureScene() {

    const section =
        document.querySelector(
            ".future-world"
        );


    if (!section) {
        return;
    }


    const particles =
        gsap.utils.toArray(
            ".particle"
        );


    const timeline =
        gsap.timeline({

            scrollTrigger: {

                trigger: section,

                start: "top bottom",

                end: "bottom top",

                scrub: 1

            }

        });


    timeline.fromTo(

        ".future-copy",

        {

            scale: .45,

            opacity: 0,

            y: 200

        },

        {

            scale: 1,

            opacity: 1,

            y: 0

        }

    );


    particles.forEach(
        function (particle, index) {

            timeline.fromTo(

                particle,

                {

                    scale: 0,

                    opacity: 0

                },

                {

                    scale:
                        1 +
                        Math.random() * 3,

                    opacity: 1,

                    x:
                        (Math.random() - .5) *
                        300,

                    y:
                        (Math.random() - .5) *
                        250

                },

                0

            );

        }
    );


    timeline.to(

        ".future-copy",

        {

            scale: 1.4,

            opacity: 0,

            y: -200

        }

    );

}


/* =========================================================
   ENDING
========================================================= */

function endingScene() {

    const section =
        document.querySelector(
            ".ending-world"
        );


    if (!section) {
        return;
    }


    const timeline =
        gsap.timeline({

            scrollTrigger: {

                trigger: section,

                start: "top bottom",

                end: "bottom bottom",

                scrub: 1

            }

        });


    timeline.fromTo(

        ".ending-number",

        {

            scale: .15,

            rotation: -20,

            opacity: 0

        },

        {

            scale: 1,

            rotation: 0,

            opacity: 1

        }

    );


    timeline.fromTo(

        ".ending-copy",

        {

            y: 250,

            opacity: 0

        },

        {

            y: 0,

            opacity: 1

        },

        "-=.3"

    );


    timeline.to(

        ".ending-number",

        {

            scale: 1.2,

            opacity: .4

        }

    );

}


/* =========================================================
   SECTION COUNTER
========================================================= */

function createCounterTriggers() {

    const sections =
        gsap.utils.toArray(
            ".world-section"
        );


    sections.forEach(
        function (section, index) {

            ScrollTrigger.create({

                trigger: section,

                start: "top center",

                end: "bottom center",

                onEnter:
                    function () {

                        updateCounter(
                            index + 1
                        );

                    },

                onEnterBack:
                    function () {

                        updateCounter(
                            index + 1
                        );

                    }

            });

        }
    );

}


function updateCounter(number) {

    if (!counter) {
        return;
    }


    gsap.to(

        counter,

        {

            y: -10,

            opacity: 0,

            duration: .15,

            onComplete:
                function () {

                    counter.textContent =
                        String(number)
                            .padStart(
                                2,
                                "0"
                            );

                    gsap.to(
                        counter,
                        {

                            y: 0,

                            opacity: 1,

                            duration: .25

                        }
                    );

                }

        }

    );

}


/* =========================================================
   HEADER EFFECT
========================================================= */

function headerEffect() {

    ScrollTrigger.create({

        start: "top -80",

        onUpdate:
            function (self) {

                const header =
                    document.getElementById(
                        "siteHeader"
                    );


                if (!header) {
                    return;
                }


                if (
                    self.scroll() > 80
                ) {

                    header.classList.add(
                        "scrolled"
                    );

                } else {

                    header.classList.remove(
                        "scrolled"
                    );

                }

            }

    });

}


/* =========================================================
   MENU
========================================================= */

function setupMenu() {

    if (!menuButton || !menuOverlay) {
        return;
    }


    menuButton.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "menu-open"
            );

        }
    );


    const links =
        menuOverlay.querySelectorAll(
            "a"
        );


    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    document.body.classList.remove(
                        "menu-open"
                    );

                }
            );

        }
    );

}


/* =========================================================
   PARALLAX HTML
========================================================= */

function htmlParallax() {

    gsap.to(

        ".hud",

        {

            y: 40,

            ease: "none",

            scrollTrigger: {

                trigger: "#experience",

                start: "top top",

                end: "bottom bottom",

                scrub: true

            }

        }

    );


    gsap.to(

        ".number-statement",

        {

            y: -100,

            ease: "none",

            scrollTrigger: {

                trigger: ".numbers-world",

                start: "top bottom",

                end: "bottom top",

                scrub: true

            }

        }

    );

}


/* =========================================================
   RESIZE
========================================================= */

function resizeThree() {

    if (!camera || !renderer) {
        return;
    }


    camera.aspect =
        window.innerWidth /
        window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

}


window.addEventListener(
    "resize",
    resizeThree
);


/* =========================================================
   EXPERIENCE START
========================================================= */

let experienceStarted = false;


function startExperience() {

    if (experienceStarted) {
        return;
    }


    experienceStarted = true;


    initThree();


    setTimeout(
        function () {

            heroScene();

            purposeScene();

            historyScene();

            numbersScene();

            businessScene();

            pillarsScene();

            impactScene();

            futureScene();

            endingScene();

            createCounterTriggers();

            headerEffect();

            htmlParallax();

            setupMenu();


            ScrollTrigger.refresh();

        },
        700
    );

}