export class IntervalHub {
    // saves regirstered Interval-IDS;
    static allIntervals = [];
    static allTimeouts = [];

    // start a new Interval and added new Interval into allIntervall-Array
    static startInterval(func, timer){
        const id = setInterval(func, timer);
        this.allIntervals.push(id);
        return id;
    }

    // 
    static startTimeout(func, timer) {
        const id = setTimeout(() => {
            func();
            this.allTimeouts = this.allTimeouts.filter(timeoutId => timeoutId !== id);
        }, timer);

        this.allTimeouts.push(id);
        return id;
    }

    // clearing all interval-arrays
    static clearAll() {
        this.allIntervals.forEach(id => clearInterval(id));
        this.allTimeouts.forEach(id => clearTimeout(id));

        this.allIntervals = [];
        this.allTimeouts = [];
    }

}