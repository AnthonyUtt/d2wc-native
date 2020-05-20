import { AccountFlat } from './types';
import 'intl';
import 'intl/locale-data/jsonp/en';

function snowball(a: AccountFlat, b: AccountFlat) {
    const balanceA = a.balance;
    const balanceB = b.balance;

    let comparison = 0;
    if (balanceA > balanceB) {
        comparison = 1;
    } else if (balanceA < balanceB) {
        comparison = -1;
    }

    return -comparison;
}

function avalanche(a: AccountFlat, b: AccountFlat) {
    const rateA = a.rate;
    const rateB = b.rate;

    let comparison = 0;
    if (rateA > rateB) {
        comparison = 1;
    } else if (rateA < rateB) {
        comparison = -1;
    }

    return comparison;
}

function custom(a: AccountFlat, b: AccountFlat, mod: number) {
    const customA = a.custom ? a.custom : 0;
    const customB = b.custom ? b.custom : 0;

    let comparison = 0;
    if (customA > customB) {
        comparison = 1;
    } else if (customA < customB) {
        comparison = -1;
    }

    return comparison * mod;
}

const customAsc = (a: AccountFlat, b: AccountFlat) => custom(a, b, -1);
const customDesc = (a: AccountFlat, b: AccountFlat) => custom(a, b, 1);

export function orderAccounts(
    accounts: Array<AccountFlat>,
    order: string,
): Array<AccountFlat> {
    let accts = accounts;
    switch (order) {
        case 'snowball':
            accts = accts.sort(snowball);
            break;
        case 'avalanche':
            accts = accts.sort(avalanche);
            break;
        case 'customAsc':
            accts = accts.sort(customAsc);
            break;
        case 'customDesc':
            accts = accts.sort(customDesc);
            break;
        default:
            break;
    }

    return accts;
}

export function printStrategy(strategy: string): string {
    switch (strategy) {
        case 'snowball':
            return 'Snowball';
        case 'avalanche':
            return 'Avalanche';
        case 'customAsc':
            return 'Custom (Ascending)';
        case 'customDesc':
            return 'Custom (Descending)';
        default:
            return '';
    }
}

export function formatCurrency(value: number): string {
    const formatter = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return formatter.format(value);
}

export function formatPercentage(value: number): string {
    return (value * 100).toFixed(2) + '%';
}
