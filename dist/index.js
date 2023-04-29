"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compound = void 0;
function compound(initial, amount, years, interest, accrualPeriod = 1, contributionPeriod = 1, contributeBeforeInterest = false) {
    initial = Number(initial) * 100;
    years = Number(years);
    interest = Number(interest);
    const periods = accrualPeriod * years;
    const offsetContribution = contributeBeforeInterest ? 0 : 1;
    const rate = interest / accrualPeriod;
    // amount can be a flat amount, an array of amounts, or a function returning an array of amounts
    const emptyYears = (() => {
        if (typeof amount === 'number') {
            if (contributionPeriod >= accrualPeriod) {
                // if we're contributing faster than we're accruing interest, roll up the contributions per accrual period
                return Array(periods).fill(amount * (contributionPeriod / accrualPeriod));
            }
            else {
                // otherwise populate the array with mix of zeroes and contributions
                return [...Array(periods)].map((x, i) => {
                    if ((i + offsetContribution) % ((12 / contributionPeriod) * (accrualPeriod / 12)) === 0) {
                        return amount;
                    }
                    else {
                        return 0;
                    }
                });
            }
        }
        else if (Array.isArray(amount)) {
            return [...Array(periods)].map((x, i) => amount[i] || 0);
        }
        else if (typeof amount === 'function') {
            return [...Array(periods)].map(amount);
        }
        return [];
    })().map(x => x * 100);
    // add "year-zero" to beginning of years
    emptyYears.unshift(0);
    const annuityTotals = [...emptyYears].map((curr, i, arr) => {
        const offsetBefore = contributeBeforeInterest ? curr : 0;
        const offsetAfter = contributeBeforeInterest ? 0 : curr;
        if (arr[i - 1] !== undefined) {
            const totalFromAnnuity = (1 + rate) * (arr[i - 1] + offsetBefore);
            return arr[i] = totalFromAnnuity + offsetAfter;
        }
        else {
            return arr[i] = initial;
        }
    }).map(x => Math.round(x) / 100);
    return {
        result: annuityTotals,
        principal: emptyYears.map(x => Math.round(x) / 100),
        total: annuityTotals[annuityTotals.length - 1]
    };
}
exports.compound = compound;
