/**
 * @desc Emits custom events of your chosing
 * 
 * @return {EventDispatch}
 */
export var EventDispatch = function () {

    /**
     * @desc Dispatch a custom event
     * @param {string} name - event name
     * @param {Callback Function} event - contains the data passed to the event
     */
    this.dispatch = function (name, event) {
        let callbacks = _this[name];
        if (callbacks) callbacks.forEach(callback => callback(event));

        return this;
    };

    /**
     * @desc Listen to a specific event
     * @param {string} name - event name
     * @param {function} callback - callback function
     */
    this.on = function (name, callback) {
        let callbacks = this[name];
        if (!callbacks) this[name] = [callback];
        else callbacks.push(callback);

        return this;
    };
}