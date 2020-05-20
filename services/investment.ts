import { InvestmentYear, InvestmentSchedule } from '../config/types';

export function createSchedule(
    period: number,
    rate: number,
    payment: number,
    float: number,
    frequency: number,
): InvestmentSchedule {
    let schedule: InvestmentSchedule = {
        summary: { principal: 0, interest: 0, value: 0 },
        years: [],
    };
    let monthlyRate = rate / 12;
    let totalPrincipal = 0;
    let totalInterest = 0;

    let month = 0;

    for (let i = 0; i < period; i++) {
        let yearlyPrincipal = 0;
        let yearlyInterest = 0;
        for (let j = 0; j < 12; j++) {
            month++;
            yearlyPrincipal += payment;
            totalPrincipal += payment;

            if (month % frequency === 0) {
                yearlyPrincipal += float;
                totalPrincipal += float;
            }

            yearlyInterest = (totalPrincipal + totalInterest) * monthlyRate;
            totalInterest += yearlyInterest;
        }

        let year: InvestmentYear = {
            principal: yearlyPrincipal,
            interest: yearlyInterest,
            totalAdded: yearlyPrincipal + yearlyInterest,
            totalValue: totalPrincipal + totalInterest,
        };

        schedule.years.push(year);
    }

    schedule.summary.principal = totalPrincipal;
    schedule.summary.interest = totalInterest;
    schedule.summary.value = totalPrincipal + totalInterest;

    return schedule;
}
