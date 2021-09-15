import { Domify } from './js/domify.js';

// slider & audio next btn animation
const next = Domify('#next .next-wrap');
next.on('mouseenter', () => {
    const tl = gsap.timeline();
    tl.to('#next .next-wrap p', {
        duration: .3,
        x: '20%',
        opacity: 0,
        ease: 'Expo.easeOut',
    }).to('#next .next-wrap svg', {
        duration: .4,
        x: '20%',
        scale: 1.2,
        opacity: 1,
        ease: 'Expo.easeIn',
    }, '-=.3');
});

next.on('mouseleave', () => {
    const tl = gsap.timeline();
    tl.to('#next .next-wrap svg', {
        duration: .4,
        x: '0%',
        scale: 1,
        ease: 'Expo.easeIn',
    }).to('#next .next-wrap p', {
        duration: .3,
        x: '0%',
        opacity: 1,
        ease: 'Expo.easeIn',
    }, '-=.3');
});