import {CapAsset, CapAssetType} from "../../db/entities/capasset.js";
import {RentalAsset} from "../../db/entities/rentalasset.js";
import {Dividend} from "../../db/entities/Dividend.js";
import {FinancialAsset} from "../../db/entities/financialasset.js";
import {OneTimeIncome} from "../../db/entities/OneTimeIncome.js";
import {
    dividendCalculation,
    incomeCalculation,
    oneTimeCalculation,
    rentalCalculation
} from "./incomeYearOutput.js";
import {taxOutput} from "../../db/types.js";


// needs to also return the amount paid in taxes for each income stream
export const incomeMonthOutput = (
    capitalIncomes: Array<CapAsset>,
    rentalIncomes: Array<RentalAsset>,
    dividends: Array<Dividend>,
    finAssets: Array<FinancialAsset>,
    oneTime: Array<OneTimeIncome>,
    month: number,
    year: number
) => {

/*
    salary
        human_capital ->human_capital (lineItem)
    investments
        dividends -> dividends (summed)
        rental -> rental (lineItem)
    retirement Income
        social_capital -> social_capital (lineItem)
 */

    const salary = {};
    const investments = {};
    const retirementIncome = {};
    const nonTaxable = {};
    const oneTimeIncome= {};
    const taxes = {} as taxOutput;
    let income = 0;

    capitalIncomes.forEach(x => {
        const toAdd = incomeCalculation(x, year);
        switch (x.type){
            case CapAssetType.HUMAN: salary[x.name] = {note: x.note, amount:toAdd.income};
                break;
            case CapAssetType.NONTAXABLEANNUITY: nonTaxable[x.name] = {note: x.note, amount:toAdd.income};
                break;
            case CapAssetType.SOCIAL: retirementIncome[x.name] = {note: x.note, amount:toAdd.income};
                break;
        }
        taxes.federal += toAdd.tax.federal;
        taxes.state += toAdd.tax.state;
        taxes.local += toAdd.tax.local;
        taxes.capitalGains += toAdd.tax.capitalGains;
        income+=toAdd.income;
    });

    rentalIncomes.forEach(x => {
        const toAdd = rentalCalculation(x, year);

        investments[x.name] = {note: x.note, amount: toAdd.income};

        taxes.federal += toAdd.tax.federal;
        taxes.state += toAdd.tax.state;
        taxes.local += toAdd.tax.local;
        taxes.capitalGains += toAdd.tax.capitalGains;
        income+=toAdd.income;
    });

    oneTime.forEach(x => {
        const toAdd = oneTimeCalculation(x, year);

        oneTimeIncome[x.name] = {note: x.note, amount: toAdd.income};

        taxes.federal += toAdd.tax.federal;
        taxes.state += toAdd.tax.state;
        taxes.local += toAdd.tax.local;
        taxes.capitalGains += toAdd.tax.capitalGains;
        income+=toAdd.income;
    });

    //soley here as a place holder for dividend disbursment
    if(month===1) {
        dividends.forEach(x => {
            const toAdd = dividendCalculation(finAssets, x);

            investments[x.name] = {note: x.note, amount: toAdd.income};

            taxes.federal += toAdd.tax.federal;
            taxes.state += toAdd.tax.state;
            taxes.local += toAdd.tax.local;
            taxes.capitalGains += toAdd.tax.capitalGains;
            income+=toAdd.income;
        });
    }
        return {salary, retirementIncome, nonTaxable, investments, OneTimeIncome, taxes, income};
};
