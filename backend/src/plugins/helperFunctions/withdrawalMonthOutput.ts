import { FinancialAsset } from "../../db/entities/financialasset.js";
import { compoundGrowthRate } from "./expenseYearOutput.js";
import {
	amount,
	monthOutputRow,
	outputRow,
	row,
	withdrawal,
	withdrawalMonth,
	withdrawalMonthOutputRow,
	withdrawalOutputRow,
} from "../../db/types.js";
import { calculateTax, dividendCalculation } from "./incomeYearOutput.js";
import { Dividend } from "../../db/entities/Dividend.js";
import { current } from "tap";

function calculatePostTaxLiquidity(item: FinancialAsset) {
	if (item.totalValue == 0) return 0;
	const tax = calculateTax(
		item.totalValue - item.costBasis,
		item.federal == null ? 0 : item.federal.rate,
		item.state == null ? 0 : item.state.rate,
		item.local == null ? 0 : item.local.rate,
		item.capitalGains == null ? 0 : item.capitalGains.rate,
		item.fica == null ? 0 : item.fica.rate
	);
	let sum = 0;
	Object.getOwnPropertyNames(tax).forEach((x) => (sum += tax[x]));
	return item.totalValue - sum;
}

function calculateWithdrawal(item: FinancialAsset, difference: number) {
	const taxRate = (item.totalValue - item.costBasis) / item.totalValue;
	let taxableAmount = taxRate * difference;
	const nonTaxableAmount = difference - taxableAmount;
	const tax = calculateTax(
		taxableAmount,
		item.federal == null ? 0 : item.federal.rate,
		item.state == null ? 0 : item.state.rate,
		item.local == null ? 0 : item.local.rate,
		item.capitalGains == null ? 0 : item.capitalGains.rate,
		item.fica == null ? 0 : item.fica.rate
	);
	Object.getOwnPropertyNames(tax).forEach((x) => (taxableAmount += tax[x]));

	item.totalValue += nonTaxableAmount + taxableAmount;
	item.costBasis = item.totalValue * taxRate;

	return nonTaxableAmount + taxableAmount;
}

//update finAssets to be current with growth
//create object with the amount withdrawn from each account
//return new array of finAssets with updated amount fields
export const withdrawalMonthOutput = (
	finAssets: Array<FinancialAsset>,
	dividends: Array<Dividend>,
	deficit: monthOutputRow,
	start: Date,
	end: Date
): withdrawalMonth => {
	const outDividend: Map<number, monthOutputRow> = new Map<number, monthOutputRow>();
	const outputWithdrawal: Map<number, withdrawalMonthOutputRow> = new Map<
		number,
		withdrawalMonthOutputRow
	>();

	for (let year = start.getFullYear(); year <= end.getFullYear(); ++year) {
		for (let month = year == start.getFullYear() ? start.getMonth() : 0; month < 12; ++month) {
			const key = JSON.stringify({ month, year });
			let currentDeficit = deficit.amounts.get(key);

			if (currentDeficit == undefined) {
				throw new Error("issue with deficit");
			}
			dividends.forEach((x, index) => {
				let currentOutDividend: monthOutputRow = outDividend.get(x.id);
				let currentAmount = 0;
				if (currentOutDividend == undefined) {
					currentOutDividend = {
						name: x.name,
						note: x.note,
						amounts: new Map<string, number>(),
					};
					outDividend.set(x.id, currentOutDividend);
				}
				if (month == 0) currentAmount = dividendCalculation(finAssets, x);
				currentOutDividend.amounts.set(key, currentAmount);
				currentDeficit += currentAmount;
			});

			finAssets
				.sort((a, b) => a.wPriority - b.wPriority)
				.forEach((x, index) => {
					const toAdd = x;
					let currentOutputWithdrawal: withdrawalMonthOutputRow = outputWithdrawal.get(x.id);

					if (currentOutputWithdrawal == undefined) {
						currentOutputWithdrawal = {
							name: x.name,
							note: x.note,
							amounts: new Map<string, number>(),
							updatedValue: new Map<string, number>(),
						};
						outputWithdrawal.set(x.id, currentOutputWithdrawal);
					}

					toAdd.totalValue = compoundGrowthRate(
						toAdd.totalValue,
						toAdd.growthRate,
						year == start.getFullYear() && month == start.getMonth() ? 0 : 1 / 12
					);
					if (currentDeficit > 0) {
						toAdd.totalValue += currentDeficit;
						toAdd.costBasis += currentDeficit;
						currentOutputWithdrawal.amounts.set(key, currentDeficit);
						currentDeficit = 0;
					} else if (currentDeficit < 0) {
						const postTaxLiquidity = calculatePostTaxLiquidity(toAdd);
						if (postTaxLiquidity <= -currentDeficit) {
							toAdd.totalValue = 0;
							toAdd.costBasis = 0;
							currentDeficit += postTaxLiquidity;
							currentOutputWithdrawal.amounts.set(key, -postTaxLiquidity);
						} else {
							const withdrawal = calculateWithdrawal(toAdd, currentDeficit);
							currentDeficit = 0;
							currentOutputWithdrawal.amounts.set(key, withdrawal);
						}
					} else currentOutputWithdrawal.amounts.set(key, 0);
					currentOutputWithdrawal.updatedValue.set(key, toAdd.totalValue);
				});
		}
	}
	return { outputWithdrawal, outDividend };
};
