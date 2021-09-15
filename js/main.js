import { Domify } from './domify.js';
'use strict';

const ROTATIONS = [0, 6, -6, 12, -12, 18, -18, 24, -24, 32, -32, 38, -38];

/**
 * @desc Rotates a set of images based on the ROTATIONS constant and animates the elements.
 * 
 * @param {Object} options 
 * @param {Array} [options.images] - The array of images to rotate.
 * @param {String?} [options.ease='in'] - Should the easing be in or out(easeIn, easeOut).
 * @param {String?} [options.parent] - The parent element selector. Must be unique(id).
 */
export let IntroAnimation = function (options) {

    const images = options.images || console.error('No images!');
    let indexFrom = 0;
    const parent = options.parent || console.error('You did\'t specify the parent!');
    const ease = (
        options.ease === 'in' ? 'Expo.easeIn' : 'Expo.easeOut'
    ) || 'Expo.easeIn';

    const animateNavigation = function () {
        const tl = gsap.timeline();

        const hold = `${parent} .navigation`;
        tl.from(hold + ' .progress-wrapper .progress-container', {
            duration: 0.8,
            width: 0,
            opacity: 0,
            ease: 'Expo.easeIn'
        }).from(hold + ' #currTime', {
            duration: 0.5,
            x: '-10%',
            opacity: 0,
            ease: 'Expo.easeIn'
        }).from(hold + ' #durTime', {
            duration: 0.5,
            x: '10%',
            opacity: 0,
            ease: 'Expo.easeIn'
        }, '-=.5').from(hold + ' .progress-wrapper .chapter-dots>*', {
            duration: 0.5,
            stagger: 0.2,
            scale: 5,
            y: '20%',
            opacity: 0,
            ease: 'Expo.easeIn'
        }, '-=.4').from(hold + ` #play`, {
            duration: 0.5,
            x: '-20%',
            opacity: 0,
            ease: 'Expo.easeIn'
        }).from(`${parent} .slide-pagination #next svg`, {
            duration: 0.5,
            x: '-30%',
            opacity: 0,
            ease: 'Expo.easeIn'
        }, '-=.5').from(`${parent} .slide-pagination #next p`, {
            duration: 0.5,
            opacity: 0,
            ease: 'Expo.easeOut'
        }, '-=.1');
    }

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
        animateNavigation();
    };
}

/**
 * @desc Slides forward(next) or backward(prev) a set of images.
 * 
 * @param {Object?} options
 * @param {String} [options.parent='.slide-wrapper'] - Slides parent element.
 * @param {Boolean} [options.usePagination=false] - Should the plugin set an eventlistener for the next and prev.
 * @param {String} [options.next=''] - If usePagination=true, specify the next trigger element.
 * @param {String} [options.prev=''] - If usePagination=true, specify the previous trigger element.
 * @param {Number} [options.speed=2] - Slide speed(the speed minimum is 2).
 * @param {String} [options.easing='Expo.easeOut'] - Slide eassing(gsap easing).
 * @param {Number} [options.degree=20] - Degree of rotation when changing between slides.
 * @return {Slidify}
 */
export let Slidify = function (options) {

    // default options
    let opts = {
        parent: '.slide-wrapper',
        usePagination: false,
        next: '',
        prev: '',
        speed: 2,
        easing: 'Expo.easeOut',
        degree: 20
    };

    let images = [];
    let index = 0;

    let that = this;


    const init = function () {
        opts.parent = options.parent || opts.parent;
        opts.usePagination = options.usePagination !== undefined ? options.usePagination : opts.usePagination;

        if (opts.usePagination) {
            options.next && (opts.next = Domify(opts.parent + ' ' + options.next));
            options.prev && (opts.prev = Domify(opts.parent + ' ' + options.prev));
        }

        opts.speed = options.speed || opts.speed;
        opts.speed < 2 && (opts.speed = 2, console.warn('Minimum speed is 2!'));

        opts.easing = options.easing || opts.easing;
        opts.degree = options.degree || opts.degree;
    };

    this.nextSlide = function () {
        index = (index < images.length - 1) ? ++index : 0;

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
                }, `-=${opts.speed / 1.35 + 0.1}`); //exp: 1.6 if duration is 2
            }

            gsap.to(images[i].style, {
                zIndex: zIndex
            });
        }
    };

    this.prevSlide = function () {
        index = (index === 0) ? images.length - 1 : --index;

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
                    x: '-140%',
                    rotate: -opts.degree,
                    ease: opts.easing
                }).to(images[i], {
                    duration: opts.speed,
                    x: '0%',
                    rotate: ROTATIONS[i],
                    ease: opts.easing,
                }, `-=${opts.speed / 1.35 + 0.1}`);
            }

            gsap.to(images[i].style, {
                zIndex: zIndex
            });
        }
    };

    const load = function () {
        init();

        images = Array.from(Domify(opts.parent + ' img').all()) || console.error('Invalid selector!');

        opts.usePagination && (
            opts.next && opts.next.click(that.nextSlide),
            opts.prev && opts.prev.click(that.prevSlide)
        );

        return that;
    }();

}

/**
 * @desc Audio player
 * 
 * @param {Object} options
 * @param {String} audioName - Specifies the filename of the audio without the extension. 
 * @param {String} parentElement - Specifies the parent element selector of the audio. Must be unique(id).
 * @param {Array<Object>} chapters - Specifies the chapters of the audio.
 */
export let AudioPlayer = function (options) {

    const parent = options.parentElement || console.warn('No parent element!');
    const audio = options.audioName;
    const chapters = options.chapters;
    const nbChapters = chapters.length;
    const that = this;
    const playBtn = Domify(`${parent} #play`).el;
    const nextBtn = Domify(`${parent} #next`).el;
    const audioContainer = Domify(`${parent} #audio-container`).el;
    const audioElement = Domify(`${parent} #audio`).el;
    const audioDuration = parseFloat(Domify(`${parent} audio`).attr('data-time'));
    const title = Domify(`${parent} #title`).el;
    const progress = Domify(`${parent} #progress`).el;
    const progressContainer = Domify(`${parent} #progress-container`).el;
    const pointersContainer = Domify(`${parent} .chapter-dots`).el;
    const currTime = Domify(`${parent} #currTime`).el;
    const durTime = Domify(`${parent} #durTime`).el;

    let slideInstance = options.slideInstance || console.warn('You didn\'t specify a slide instance!');
    let currentChapter = 0;
    let progressClicked = false;

    // Load audio
    const loadAudio = function () {
        title.innerText = chapters[0].title;
        audioElement.src = `audio/${audio}.mp3`;
    }();

    // Init audio chapter pointers
    const initChapterPointers = function () {
        let x = 0;
        while (x < nbChapters) {
            // create pointer
            const pointer = document.createElement('div');
            pointer.classList.add('dot');

            // position pointer
            const progressPercent = (chapters[x].time / audioDuration) * 100;
            pointer.style.left = `${progressPercent}%`;
            pointer.setAttribute('data-prefix', `${progressPercent}%`);

            pointersContainer.appendChild(pointer);
            x++;
        }
    }();

    // Play audio
    this.playAudio = function () {
        loadChapter(chapters[currentChapter]);

        audioContainer.classList.add('play');
        playBtn.querySelector('i.fas').classList.remove('fa-play');
        playBtn.querySelector('i.fas').classList.add('fa-pause');

        audioElement.play();
    }

    // Pause audio
    this.pauseAudio = function (ended = false) {
        if (ended) {
            currentChapter = 0;
            slideInstance.nextSlide();
        }

        audioContainer.classList.remove('play');
        playBtn.querySelector('i.fas').classList.add('fa-play');
        playBtn.querySelector('i.fas').classList.remove('fa-pause');

        audioElement.pause();
    }

    // Next chapter
    const nextChapter = function () {
        currentChapter++;

        if (currentChapter > chapters.length - 1) {
            currentChapter = 0;
        }

        loadChapter(chapters[currentChapter]);
    }

    // Load chapter
    const loadChapter = function (chapter) {
        title.innerText = chapter.title;
        audioElement.currentTime = chapter.time;
    }

    // Get chapter index by currentTime
    const getChapterIndex = function (currentTime) {
        for (let i = 0; i < chapters.length - 1; i++) {
            if (chapters[i].time <= currentTime && chapters[i + 1].time > currentTime)
                return i;
        }

        return chapters.length - 1;
    }

    // Update progress bar
    const updateProgress = function (e) {
        const { duration, currentTime } = e.srcElement;

        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        let chapterIndex = getChapterIndex(currentTime);
        if (progressClicked) {
            if (currentChapter < chapterIndex)
                while (chapterIndex !== currentChapter) {
                    slideInstance.nextSlide();
                    currentChapter++;
                }

            if (currentChapter > chapterIndex)
                while (chapterIndex !== currentChapter) {
                    slideInstance.prevSlide();
                    currentChapter--;
                }

            progressClicked = false;
        }
    }

    // Set progress bar
    const setProgress = function (e) {
        progressClicked = true;
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioElement.duration;

        audioElement.currentTime = (clickX / width) * duration;
    }

    //get duration & currentTime for Time of audio
    const calcDurationAndTime = function (e) {
        const { duration, currentTime } = e.srcElement;
        var sec;
        var sec_d;

        // define minutes currentTime
        let min = (currentTime == null) ? 0 :
            Math.floor(currentTime / 60);
        min = min < 10 ? '0' + min : min;

        // define seconds currentTime
        function get_sec(x) {
            if (Math.floor(x) >= 60) {
                for (var i = 1; i <= 60; i++) {
                    if (Math.floor(x) >= (60 * i) && Math.floor(x) < (60 * (i + 1))) {
                        sec = Math.floor(x) - (60 * i);
                        sec = sec < 10 ? '0' + sec : sec;
                    }
                }
            } else {
                sec = Math.floor(x);
                sec = sec < 10 ? '0' + sec : sec;
            }
        }

        get_sec(currentTime, sec);

        // change currentTime DOM
        currTime && (currTime.innerHTML = min + ':' + sec);

        // define minutes duration
        let min_d = (isNaN(duration) === true) ? '0' : Math.floor(duration / 60);
        min_d = min_d < 10 ? '0' + min_d : min_d;


        function get_sec_d(x) {
            if (Math.floor(x) >= 60) {

                for (var i = 1; i <= 60; i++) {
                    if (Math.floor(x) >= (60 * i) && Math.floor(x) < (60 * (i + 1))) {
                        sec_d = Math.floor(x) - (60 * i);
                        sec_d = sec_d < 10 ? '0' + sec_d : sec_d;
                    }
                }
            } else {
                sec_d = (isNaN(duration) === true) ? '0' : Math.floor(x);
                sec_d = sec_d < 10 ? '0' + sec_d : sec_d;
            }
        }

        // define seconds duration

        get_sec_d(duration);

        // change duration DOM
        durTime && (durTime.innerHTML = min_d + ':' + sec_d);

    };

    // Event listeners
    playBtn.addEventListener('click', () => {
        const isPlaying = audioContainer.classList.contains('play');

        if (isPlaying) {
            that.pauseAudio();
        } else {
            that.playAudio();
        }
    });

    // Change chapter
    nextBtn.addEventListener('click', nextChapter);

    // Time/audio update
    audioElement.addEventListener('timeupdate', updateProgress);

    // Click on progress bar
    progressContainer.addEventListener('click', setProgress);

    // Audio ends
    audioElement.addEventListener('ended', () => this.pauseAudio(true));

    // Time of audio
    audioElement.addEventListener('timeupdate', calcDurationAndTime);

    // Pointer Click and Hover
    const pointers = Domify(`${parent} .chapter-dots .dot`).all();
    const info = Domify(`${parent} .music-info`).el;
    pointers.forEach((pointer, index) => {
        pointer.addEventListener('click', () => {
            loadChapter(chapters[index]);

            for (let i = 0; i < Math.abs(index - currentChapter); i++) {
                function inc() {
                    if (currentChapter > index) {
                        slideInstance.prevSlide();
                        currentChapter--;
                    } else {
                        slideInstance.nextSlide();
                        currentChapter++;
                    }

                    (currentChapter !== index) && inc();
                    currentChapter = index;
                }
                inc();
            }

        });

        pointer.addEventListener('mouseenter', () => {
            title.innerText = chapters[index].title;

            const prefix = pointer.getAttribute('data-prefix');
            gsap.to(info, {
                display: 'initial',
                left: prefix,
                opacity: 1,
                ease: "Expo.easeOut"
            });
        });

        pointer.addEventListener('mouseleave', () => {
            gsap.to(info, {
                display: 'none',
                left: 0,
                opacity: 0,
                ease: "Expo.easeOut"
            });
        });
    });

}