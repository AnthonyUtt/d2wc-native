import {
    AccountFlat as Account,
    Payment,
    MonthlyPayment,
    Schedule,
} from '../config/types';

const toMonthDate = (date: Date) =>
    `${date.getMonth() + 1}/${date.getFullYear().toString().substr(2)}`;

export async function createSchedule(
    accounts: Array<Account>,
    payment: number,
    float: number,
    frequency: number,
): Promise<Schedule> {
    let accts: Array<Account> = [];
    accounts.forEach((acct) => accts.push({ ...acct }));

    let done: boolean = false;

    let schedule: Array<MonthlyPayment> = [];
    let startDate = new Date(Date.now());
    startDate.setMonth(startDate.getMonth() + 1);
    startDate.setDate(1);
    let totalMonths = 0;

    let remainingTotal = 0;
    let paymentDate = startDate;
    let interestPaid = 0;
    accts.forEach((acct) => (remainingTotal += acct.balance));
    let debt = remainingTotal;

    do {
        totalMonths += 1;
        let payments: Array<Payment> = [];
        let payTotal =
            Number(payment) + Number(totalMonths % frequency === 0 ? float : 0);

        accts.forEach((acct) => {
            if (acct.balance > 0) {
                payTotal -= acct.payment;

                let interest = (acct.balance * acct.rate) / 12;
                interestPaid += interest;

                let change = -acct.payment + interest;
                acct.balance += change;

                payments.push({ account: acct.id, amount: acct.payment });
            } else {
                payments.push({ account: acct.id, amount: 0 });
            }
        });
        accts[accts.length - 1].balance -= payTotal;
        payments[payments.length - 1].amount += payTotal;

        if (accts[accts.length - 1].balance <= 0) {
            let overflow = accts[accts.length - 1].balance;
            payments[payments.length - 1].amount += overflow;
            accts = accts.slice(0, accts.length - 1);
            if (accts.length > 0) {
                accts[accts.length - 1].balance += overflow;
                if (payments[payments.length - 2].amount > 0) {
                    payments[payments.length - 2].amount += -overflow;
                }
            } else {
                done = true;
            }
        }

        while (payments.length < accounts.length) {
            let acctIdx = accounts.length - payments.length - 1;

            payments.push({ account: accounts[acctIdx].id, amount: 0 });
        }

        let monthlyPayment: MonthlyPayment = {
            month: toMonthDate(paymentDate),
            payments: payments.reverse(),
            paid: false,
        };
        schedule.push(monthlyPayment);
        remainingTotal -= payTotal;
        paymentDate.setMonth(paymentDate.getMonth() + 1);
    } while (!done && remainingTotal + interestPaid > 0);

    return {
        debt,
        interest: interestPaid,
        total: debt + interestPaid,
        monthsToFinish: totalMonths,
        payments: schedule,
    };
}
