/**
 * Stores and clears intervals and timeouts globally.
 */
export class IntervalHub {
    // saves regirstered Interval-IDS;
    static allIntervals = [];
    static allTimeouts = [];

    // start a new Interval and added new Interval into allIntervall-Array
    /**
     * Starts an interval and stores its id.
     * @param {Function} func
     * @param {number} timer
     * @returns {number}
     */
    static startInterval(func, timer){
        const id = setInterval(func, timer);
        this.allIntervals.push(id);
        return id;
    }

    // 
    /**
     * Starts a timeout and stores its id.
     * @param {Function} func
     * @param {number} timer
     * @returns {number}
     */
    static startTimeout(func, timer) {
        const id = setTimeout(() => {
            func();
            this.allTimeouts = this.allTimeouts.filter(timeoutId => timeoutId !== id);
        }, timer);

        this.allTimeouts.push(id);
        return id;
    }

    // clearing all interval-arrays
    /**
     * Clears all stored intervals and timeouts.
     * @returns {void}
     */
    static clearAll() {
        this.allIntervals.forEach(id => clearInterval(id));
        this.allTimeouts.forEach(id => clearTimeout(id));

        this.allIntervals = [];
        this.allTimeouts = [];
    }

}