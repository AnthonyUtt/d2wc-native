export type AccountFlat = {
    id: string;
    creditor: string;
    balance: number;
    rate: number;
    payment: number;
    custom: number | null;
};

export type Account = {
    id: string;
    data: () => {
        creditor: string;
        balance: number;
        rate: number;
        payment: number;
        custom: number | null;
    };
};

export type Payment = {
    account: string;
    amount: number;
};

export type MonthlyPayment = {
    month: string;
    paid: boolean;
    payments: Array<Payment>;
};

export type Schedule = {
    debt: number;
    interest: number;
    total: number;
    monthsToFinish: number;
    payments: Array<MonthlyPayment>;
};

export type InvestmentSummary = {
    principal: number;
    interest: number;
    value: number;
};

export type InvestmentYear = {
    principal: number;
    interest: number;
    totalAdded: number;
    totalValue: number;
};

export type InvestmentSchedule = {
    summary: InvestmentSummary;
    years: Array<InvestmentYear>;
};
