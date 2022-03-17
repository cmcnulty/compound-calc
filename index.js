module.exports = (initial, amount, years, interest, period = 1, contributeBeforeInterest = false) => {
    initial = Number(initial)*100;
    years = Number(years) * period;
    interest = Number(interest);
    period = Number(period);
    rate = interest/period;

    // amount can be a flat amount, an array of amounts, or a function returning an array of amounts
    const emptyYears = (() => {
        if (typeof amount === "number") {
            return Array(years).fill(amount/period);
        } else if(Array.isArray(amount)) {
            return [...Array(years)].map( (x, i) => amount[i] || 0);
        } else if (typeof amount === "function"){
            return [...Array(years)].map( amount );
        }
    })().map( x => x*100);

    // add "year-zero" to beginning of years
    emptyYears.unshift(0);

    const principalTotals = [...emptyYears].map((curr, i, array) => {
        if(array[i-1]) {
            return array[i] += array[i-1];
        } else {
            return array[i] = initial;
        }
    }).map( x => x/100);

    const annuityTotals = [...emptyYears].map((curr, i, arr) => {
        const offsetBefore = contributeBeforeInterest ? curr : 0;
        const offsetAfter = contributeBeforeInterest ? 0 : curr;
        if(arr[i-1]) {
            const totalFromAnnuity = (1+rate) * (arr[i-1] + offsetBefore);
            return arr[i] = totalFromAnnuity + offsetAfter;
        } else {
            return arr[i] = initial;
        }
    }).map( x => Math.round(x)/100);

    return {result: annuityTotals, principal: principalTotals, total: annuityTotals[annuityTotals.length - 1]};
}