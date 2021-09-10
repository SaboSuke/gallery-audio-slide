'use strict';

const ROTATIONS = [0, 6, -6, 12, -12, 18, -18, 24, -24, 32, -32, 38, -38];

/**
 * @desc Rotates a set of images based on the ROTATIONS constant.
 * 
 * @param {Object} options 
 * @param {Array} [options.images] - The array of images to rotate.
 * @param {String?} [options.ease='in'] - Should the easing be in or out(easeIn, easeOut).
 */
export let OrientateImages = function (options) {

    const images = options.images || console.error('No images!');
    let indexFrom = 0;
    const ease = (
        options.ease === 'in' ? 'Expo.easeIn' : 'Expo.easeOut'
    ) || 'Expo.easeIn';

    const staggerImages = function () {
        let delay = 0;
        images.forEach(image => {
            gsap.from(image, {
                delay,
                duration: (options.ease && options.ease === 'in') ? 0.8 : 1,
                opacity: 0,
                scale: 0.5,
                y: '20%',
                ease
            });

            delay += 0.1;
        });
    };

    this.init = function () {
        images.reverse().map(image => {
            image.style.zIndex = indexFrom;
            indexFrom++;

            return image;
        }).reverse().forEach((image, index) => {
            gsap.to(image, {
                delay: 1,
                duration: 2,
                rotate: ROTATIONS[index],
                ease: Elastic.easeOut.config(2.5, 0.5),
            });
        });

        staggerImages();
    };
}

/**
 * @desc Slides forward(next) or backward(prev) a set of images.
 * 
 * @param {Object?} options
 * @param {String} [options.parent='.slide-wrapper'] - Slides parent element.
 * @param {Boolean} [options.usePagination=true] - Should the plugin set an eventlistener for the next and prev.
 * @param {String} [options.next='.slide-next'] - If usePagination=true, specify the next trigger element.
 * @param {String} [options.prev='.slide-prev'] - If usePagination=true, specify the previous trigger element.
 * @param {Number} [options.speed=2] - Slide speed(the speed minimum is 2).
 * @param {String} [options.easing='Expo.easeOut'] - Slide eassing(gsap easing).
 * @param {Number} [options.degree=20] - Degree of rotation when changing between slides.
 * @param {Boolean} [options.enableStagger=false] - Enables staggering effect when changing between slides.
 * @param {Number} [options.staggerDistance=20] - If enableStagger=true, specify the staggering distance(better to not exceed 60).
 * @param {Number} [options.staggerStrength=0.8] - If enableStagger=true, specify the staggering strength(better to not exceed 2).
 * @param {Number} [options.staggerDelay=0.1] - If enableStagger=true, specify the staggering delay(delay between elements).
 * @return {Slidify}
 */
export let Slidify = function (options) {

    // default options
    let opts = {
        parent: '.slide-wrapper',
        usePagination: true,
        next: '.slide-next',
        prev: '.slide-prev',
        speed: 2,
        easing: 'Expo.easeOut',
        degree: 20,
        enableStagger: false,
        staggerDistance: 20,
        staggerStrength: 0.8,
        staggerDelay: 0.1,
    };

    let images = [];
    let index = 0;

    let that = this;


    const init = function () {
        opts.parent = options.parent || opts.parent;
        opts.usePagination = options.usePagination !== undefined ? options.usePagination : opts.usePagination;

        if (opts.usePagination) {
            opts.next = document.querySelector(opts.next);
            options.next && (opts.next = document.querySelector(options.next));

            opts.prev = document.querySelector(opts.prev);
            options.prev && (opts.prev = document.querySelector(options.prev));
        }

        opts.speed = options.speed || opts.speed;
        opts.speed < 2 && (opts.speed = 2, console.warn('Minimum speed is 2!'));

        opts.easing = options.easing || opts.easing;
        opts.degree = options.degree || opts.degree;
        opts.enableStagger = options.enableStagger || opts.enableStagger;
        opts.staggerDistance = options.staggerDistance || opts.staggerDistance;
        opts.staggerStrength = options.staggerStrength || opts.staggerStrength;
        opts.staggerDelay = options.staggerDelay || opts.staggerDelay;
    };

    this.nextSlide = function () {
        index = (index < images.length - 1) ? ++index : 0;

        let delay = 0;
        for (let i = 0; i < images.length; i++) {
            let zIndex = images.length - 1;
            if (i < index) {
                zIndex = index - (i + 1);
            } else if (i > index) {
                zIndex = (images.length - 1) - (i - index);
            }

            if ((i < index && zIndex === 0) || (i === images.length - 1 && zIndex === 0)) {
                const tl = gsap.timeline();
                tl.to(images[i], {
                    delay: 0.05,
                    duration: opts.speed,
                    x: '140%',
                    rotate: opts.degree,
                    ease: opts.easing
                }).to(images[i], {
                    duration: opts.speed,
                    x: '0%',
                    rotate: ROTATIONS[i],
                    ease: opts.easing,
                }, `-=${opts.speed / 1.35 + 0.1}`); //exaple: 1.6 if duration is 2
            } else if (opts.enableStagger) {
                const tl = gsap.timeline();
                tl.to(images[i], {
                    delay,
                    duration: 0.8,
                    x: opts.staggerDistance + '%',
                    ease: Elastic.easeOut.config(opts.staggerStrength, 0.4),
                }).to(images[i], {
                    duration: 0.8,
                    x: 0,
                    ease: Elastic.easeOut.config(opts.staggerStrength, 0.4),
                }, '-=.5');

                delay += opts.staggerDelay;
            }

            gsap.to(images[i].style, {
                zIndex: zIndex
            });
        }
    };

    this.prevSlide = function () {
        index = (index === 0) ? images.length - 1 : --index;

        let delay = 0;
        for (let i = 0; i < images.length; i++) {
            let zIndex = images.length - 1;
            if (i < index) {
                zIndex = index - (i + 1);
            } else if (i > index) {
                zIndex = (images.length - 1) - (i - index);
            }

            if ((i === index && zIndex === images.length - 1)) {
                const tl = gsap.timeline();
                tl.to(images[i], {
                    delay: 0.05,
                    duration: opts.speed,
                    x: '-160%',
                    rotate: -opts.degree,
                    ease: opts.easing
                }).to(images[i], {
                    duration: opts.speed,
                    x: '0%',
                    rotate: ROTATIONS[i],
                    ease: opts.easing,
                }, `-=${opts.speed / 1.35 + 0.1}`);
            } else if (opts.enableStagger) {
                const tl = gsap.timeline();
                tl.to(images[i], {
                    delay,
                    duration: 0.8,
                    x: `-${opts.staggerDistance}%`,
                    ease: Elastic.easeOut.config(opts.staggerStrength, 0.4),
                }).to(images[i], {
                    duration: 0.8,
                    x: 0,
                    ease: Elastic.easeOut.config(opts.staggerStrength, 0.4),
                }, '-=.5');

                delay += opts.staggerDelay;
            }

            gsap.to(images[i].style, {
                zIndex: zIndex
            });
        }
    };

    const load = function () {
        init();

        images = Array.from(document.querySelectorAll(opts.parent + ' img')) || console.error('Invalid selector!');

        opts.usePagination && (
            opts.next.addEventListener('click', that.nextSlide),
            opts.prev.addEventListener('click', that.prevSlide)
        );

        return that;
    }();

}