import {CapAsset} from "../../db/entities/capasset.js";
import {RentalAsset} from "../../db/entities/rentalasset.js";
import {Dividend} from "../../db/entities/Dividend.js";
import {FinancialAsset} from "../../db/entities/financialasset.js";
import {OneTimeIncome} from "../../db/entities/OneTimeIncome.js";
import {Recurrence} from "../../db/entities/budgetItem.js";
import {compoundGrowthRate} from "./expenseYearOutput.js";


// needs to also return the amount paid in taxes for each income stream
export const incomeYearOutput = (
    capitalIncomes: Array<CapAsset>,
    rentalIncome: Array<RentalAsset>,
    dividends: Array<Dividend>,
    finAssets: Array<FinancialAsset>,
    oneTime: Array<OneTimeIncome>,
    year: number
) => {
    let outCapital: number = 0;
    let outRental: number = 0;
    let outDividend: number = 0;
    let outOneTime: number = 0;
    let taxes: number = 0;

    capitalIncomes.forEach((x) => {
        const toAdd = incomeCalculation(x, year);
        outCapital += toAdd.income*12;
        Object.getOwnPropertyNames(toAdd.tax).forEach(x=>taxes+=toAdd.tax[x]);
    });

    rentalIncome.forEach((x) => {
        const toAdd = rentalCalculation(x, year);
        outRental += toAdd.income*12;
        Object.getOwnPropertyNames(toAdd.tax).forEach(x=>taxes+=toAdd.tax[x]);
    });

    dividends.forEach((x) => {
        const toAdd= dividendCalculation(finAssets, x);
        outDividend = toAdd.income;
        Object.getOwnPropertyNames(toAdd.tax).forEach(x=>taxes+=toAdd.tax[x]);
    });

    oneTime.forEach((x) => {
        const toAdd = oneTimeCalculation(x, year);
        outOneTime = toAdd.income
        Object.getOwnPropertyNames(toAdd.tax).forEach(x=>taxes+=toAdd.tax[x]);
    });

    return { outCapital, outRental, outDividend, outOneTime, taxes };
};
export function calculateTax(income: number, federal: number, state: number, local: number, capitalGains: number) {
    return { federal: income * federal, state: income*state, local: income*local, capitalGains: income*capitalGains};
}
//assume rental income is update for withdrawals from previous years in array of assets passed in/
// assumption remains the same for fin assets used to calculate dividends
export function oneTimeCalculation(x: OneTimeIncome, year: number) {
    const income = compoundGrowthRate(x.cashBasis, 1, year - x.created_at.getFullYear());
    const tax = calculateTax(
        income,
        x.federal == null ? 0 : x.federal.rate,
        x.state == null ? 0 : x.state.rate,
        x.local == null ? 0 : x.local.rate,
        x.capitalGains== null ? 0 : x.capitalGains.rate
    );
    return {income, tax};
}

export function dividendCalculation(finAssets: Array<FinancialAsset>, x: Dividend) {
    const value = finAssets.find((y) => y.id == x.asset.id);
    const income = x.rate * value.totalValue;
    const tax = calculateTax(
        income,
        x.federal == null ? 0 : x.federal.rate,
        x.state == null ? 0 : x.state.rate,
        x.local == null ? 0 : x.local.rate,
    x.capitalGains== null ? 0 : x.capitalGains.rate
    );
    return {income, tax};
}
export function incomeCalculation(item: CapAsset, year: number) {
    let income: number;
    switch (item.recurrence) {
        case Recurrence.DAILY:
            income = item.income * 30.437;
            break;
        case Recurrence.WEEKLY:
            income = item.income * 4.3;
            break;
        case Recurrence.MONTHLY:
            income = item.income;
            break;
        case Recurrence.ANNUALLY:
            income = item.income/12;
            break;
        case Recurrence.NON:
            income = item.income;
            break;
    }
    //need to get inflation amount from api and add to growth rate
    income = compoundGrowthRate(income, item.growthRate, year - item.start.getFullYear());
    const tax = calculateTax(
        income,
        item.federal == null ? 0 : item.federal.rate,
        item.state == null ? 0 : item.state.rate,
        item.local == null ? 0 : item.local.rate,
        item.capitalGains== null ? 0 : item.capitalGains.rate
    );
    return { income, tax };
}

export function rentalCalculation(item: RentalAsset, year: number) {
    const income = compoundGrowthRate(
        item.grossIncome - item.maintenanceExpense,
        item.growthRate,
        year - item.created_at.getFullYear()
    );
    const tax = calculateTax(
        income,
        item.federal == null ? 0 : item.federal.rate,
        item.state == null ? 0 : item.state.rate,
        item.local == null ? 0 : item.local.rate,
        item.capitalGains== null ? 0 : item.capitalGains.rate
    );
    return { income, tax };
}
