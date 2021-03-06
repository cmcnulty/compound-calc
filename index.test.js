const calc = require('./index');

/* Independently determined expected values with:
* http://www.moneychimp.com/calculator/compound_interest_calculator.htm
* https://www.thecalculatorsite.com/finance/calculators/compoundinterestcalculator.php
* https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator
*/

describe('index.js', () => {
  test('1,000 seed, 100/year, 10 years 5%, 1 interest period, accrue interest at end', () => {
    const x = 100;
    const result = calc(1000,x,10,.05,1,1, false).total;
    expect(result).toEqual(2886.68);
  });

  test('1,000 seed, 100/year, 10 years 5%, 1 interest period, accrue interest at start', () => {
    const x = 100;
    const result = calc(1000,x,10,.05,1,1, true).total;
    expect(result).toEqual(2949.57);
  });

  test('1,000 seed, 100/month, 10 years 5%, compounded monthly, accrue interest at start', () => {
    const x = 100;
    const result = calc(1000,x,10,.05,12,12, false).total;
    expect(result).toEqual(17175.24);
  });

  test('1,000 seed, 100/month, 10 years 5%, compounded monthly, accrue interest at end', () => {
    const x = 100;
    const result = calc(1000,x,10,.05,12,12, true).total;
    expect(result).toEqual(17239.94);
  });

  test('zero money at zero percent', () => {
    const x = 0;
    const result = calc(0,x,10,0,12,12, true).total;
    expect(result).toEqual(0);
  });

  test('$100 seed at zero percent', () => {
    const x = 0;
    const result = calc(100,x,10,0,12,12, true).total;
    expect(result).toEqual(100);
  });

  test('$100 contributions at zero percent', () => {
    const x = 100;
    const prod = calc(0,x,10,0,1,1, true);
    expect(prod.total).toEqual(1000);
  });

  test('Annual accrual, monthly contributions', () => {
    const x = 100;
    const prod = calc(0,x,1,.1,1,12, true);
    expect(prod.total).toEqual(1320);
  });

  test('Annual contribution, monthly accruals, interest after contribution', () => {
    const x = 100;
    const prod = calc(0,x,1,.1,12,1, true);
    expect(prod.total).toEqual(110.47);
  });

  test('Annual contribution, monthly accruals, interest before contribution', () => {
    const x = 100;
    const prod = calc(0,x,1,.1,12,1, false);
    expect(prod.total).toEqual(100);
  });

  test('Manually inputted contributions, flat',() => {
    const x = [...Array(10).fill(100)];
    const result = calc(1000,x,10,.05,1,1, false).total;
    expect(result).toEqual(2886.68);
  });

  test('Manually inputted contributions, increasing',() => {
    const increasingConts = calc(1000,0,10,.1,1,1, false).result;
    const result = calc(1000,increasingConts,10,.1,1,1, true);
    // verified result with https://www.calcxml.com/do/interest-calculator?skn=#detailedResultsTop
    expect(result.total).toEqual(28531.17);
  });

  test('Contributions function, increasing',() => {
    const increasingConts = calc(100,0,10,.05,1,1, false).result;
    const x = (row, i) => {
      return increasingConts[i];
    };
    const result = calc(1000,x,10,.05,1,1, false);
    expect(result.total).toEqual(3180.22);
  });

  // https://www.vertex42.com/Calculators/compound-interest-calculator.html#rate-per-period
  test('Quarterly contributions, monthly interest',() => {
    const result = calc(0,100,1,.1,12,4, false);
    console.log(result);
    expect(result.total).toEqual(415.38);
  });

});