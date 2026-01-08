export class IntervalHub {
    // saves regirstered Interval-IDS;
    static allIntervalls = [];

    // start a new Interval and added new Interval into allIntervall-Array
    static startInterval(func, timer){
        const newInterval = setInterval(func, timer);
        IntervalHub.allIntervalls.push(newInterval);
    }

    // stops all regirstered Interval-IDS & clear allIntervall-Array
    static stopInterval() {
        IntervalHub.allIntervalls.forEach(clearInterval);
        IntervalHub.allIntervalls = [];
    }

    // 
    static startTimeout(func, timer) {
        const id = setTimeout(() => {
            func();
            this.allIntervalls = this.allIntervalls.filter(i => i !== id);
        }, timer);

        this.allIntervalls.push(id);
        return id;
    }

    // clearing all interval-arrays
    static clearAll() {
        this.allIntervalls.forEach(clearInterval);
        this.allIntervalls = [];
    }

}