// periods represents divisions of year - e.g. 1 = annual, 2 = semi-annual, 4 = quarterly, 12 = monthly
// if accrual period = 1, and contribution = 12, that means that the contribution will occur 12 times,
// but interest will only occur once (might as well have been annual contribution)
// But, if contribution = monthly, and accrual is quarterly
// contributionAccrualAmount = amount * (contributionPeriod/accrualPeriod)
// $100 monthly contribution, quarterly accrual = $100 * (12/4) = $300/accrual period = [300,300,300,300]
// $100 semi-annual contribution, bimonthly accrual = $100 * (2/6) = [100,0,0,100,0,0]
export type Contributor = (period: number, i: number) => number;
type Compounded = {
    result: number[];
    principal: number[];
    total: number;
};

export function compound (initial: number, amount: number|number[]|Contributor, years: number, interest: number, accrualPeriod:number = 1, contributionPeriod:number = 1, contributeBeforeInterest:boolean = false): Compounded {
    initial = Number(initial)*100;
    years = Number(years);
    interest = Number(interest);

    const periods = accrualPeriod * years;
    const offsetContribution = contributeBeforeInterest ? 0 : 1;
    const rate = interest/accrualPeriod;

    // amount can be a flat amount, an array of amounts, or a function returning an array of amounts
    const emptyYears = (() => {
        if (typeof amount === 'number') {

            if(contributionPeriod >= accrualPeriod){
                // if we're contributing faster than we're accruing interest, roll up the contributions per accrual period
                return Array(periods).fill(amount * (contributionPeriod/accrualPeriod));
            } else {
                // otherwise populate the array with mix of zeroes and contributions
                return [...Array(periods)].map( (x, i) => {
                    if ( (i+offsetContribution) % ((12/contributionPeriod)*(accrualPeriod/12))===0) {
                        return amount;
                    } else {
                        return 0;
                    }
                });
            }

        } else if(Array.isArray(amount)) {
            return [...Array(periods)].map( (x, i) => amount[i] || 0);
        } else if (typeof amount === 'function'){
            return [...Array(periods)].map( amount );
        }
        return [];
    })().map( x => x*100);

    // add "year-zero" to beginning of years
    emptyYears.unshift(0);

    const annuityTotals = [...emptyYears].map((curr, i, arr) => {
        const offsetBefore = contributeBeforeInterest ? curr : 0;
        const offsetAfter = contributeBeforeInterest ? 0 : curr;
        if(arr[i-1] !== undefined) {
            const totalFromAnnuity = (1+rate) * (arr[i-1] + offsetBefore);
            return arr[i] = totalFromAnnuity + offsetAfter;
        } else {
            return arr[i] = initial;
        }
    }).map( x => Math.round(x)/100);

    return {
        result: annuityTotals,
        principal: emptyYears.map( x => Math.round(x)/100),
        total: annuityTotals[annuityTotals.length - 1]
    };
}
