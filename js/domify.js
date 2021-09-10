/**
 * @desc Eases manipulate the DOM.
 * 
 * @param {String} selector 
 * @returns {Domify}
 */
export const Domify = (selector) => {
    const self = {
        el: document.querySelector(selector),
        all: () => document.querySelectorAll(selector),
        click: (callback) => {
            self.el.addEventListener('click', callback);
            return self;
        },
        on: (event, callback) => {
            self.el.addEventListener(event, callback);
            return self;
        },
        hide: () => {
            self.el.style.display = 'none';
            return self;
        },
        show: () => {
            self.el.style.display = 'inherit';
            return self;
        },
        attr: (name, value = null) => {
            if (value == null) return self.el.getAttribute(name);
            else self.el.setAttribute(name, value);
            return self;
        },
        addClass: (className) => {
            self.el.classList.add(className);
            return self;
        },
        removeClass: (className) => {
            self.el.classList.remove(className);
            return self;
        },
        replaceClass: (className, replaceWith) => {
            self.el.classList.replace(className, replaceWith);
            return self;
        },
    };

    return self;
};