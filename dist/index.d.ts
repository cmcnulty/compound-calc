export type Contributor = (period: number, i: number) => number;
type Compounded = {
    result: number[];
    principal: number[];
    total: number;
};
declare function compound(initial: number, amount: number | number[] | Contributor, years: number, interest: number, accrualPeriod?: number, contributionPeriod?: number, contributeBeforeInterest?: boolean): Compounded;
export default compound;
