import {FinancialAsset} from "../../db/entities/financialasset.js";
import {compoundGrowthRate} from "./expenseYearOutput.js";

function calculatePostTaxLiquidity(item: FinancialAsset) {
    return item.totalValue;
}

function calculateWithdrawal(item: FinancialAsset, difference: number) {
    return difference;
}


//update finAssets to be current with growth
//create object with the amount withdrawn from each account
//return new array of finAssets with updated amount fields
export const withdrawalOutput = (finAssets: Array<FinancialAsset>, difference: number, period: number) => {
    const outputWithdrawals = {};

    finAssets
        .sort((a, b) => a.wPriority - b.wPriority)
        .filter((x) => x.totalValue > 0)
        .forEach((x) => {
            const toAdd = x;
            toAdd.totalValue = compoundGrowthRate(toAdd.totalValue, Math.pow(toAdd.growthRate,period), 1);
            if (difference < 0) {
                toAdd.totalValue -= difference;
                toAdd.costBasis -= difference;
                outputWithdrawals[toAdd.name] = { deposit: -difference };
                difference = 0;
            } else if (difference > 0) {
                const postTaxLiquidity = calculatePostTaxLiquidity(toAdd);
                if (postTaxLiquidity <= difference) {
                    toAdd.totalValue = 0;
                    toAdd.costBasis = 0;
                    difference -= postTaxLiquidity;
                    outputWithdrawals[toAdd.name] = { withdrawal: postTaxLiquidity };
                } else {
                    const withdrawal = calculateWithdrawal(toAdd, difference);
                    difference = 0;
                    outputWithdrawals[toAdd.name] = { withdrawal: withdrawal };
                    toAdd.totalValue -= withdrawal;
                }
            }
        });

    return {outputWithdrawals, difference};
};

