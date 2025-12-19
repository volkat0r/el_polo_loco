export class IntervallHub {
    // saves regirstered Interval-IDS;
    static allIntervalls = [];

    // start a new Interval and added new Interval into allIntervall-Array
    static startInterval(func, timer){
        const newInterval = setInterval(func, timer);
        IntervallHub.allIntervalls.push(newInterval);
    }

    // stops all regirstered Interval-IDS & clear allIntervall-Array
    static stopInterval() {
        IntervallHub.allIntervalls.forEach(clearInterval);
        IntervallHub.allIntervalls = [];
    }
}