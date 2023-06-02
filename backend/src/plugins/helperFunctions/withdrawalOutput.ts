import { FinancialAsset } from "../../db/entities/financialasset.js";
import { compoundGrowthRate } from "./expenseYearOutput.js";
import { amount, outputRow, row, withdrawal, withdrawalOutputRow } from "../../db/types.js";
import { calculateTax, dividendCalculation } from "./incomeYearOutput.js";
import { Dividend } from "../../db/entities/Dividend.js";
import { current } from "tap";

function calculatePostTaxLiquidity(item: FinancialAsset) {
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

	item.totalValue -= nonTaxableAmount + taxableAmount;
	item.costBasis = item.totalValue * taxRate;

	return nonTaxableAmount + taxableAmount;
}

//update finAssets to be current with growth
//create object with the amount withdrawn from each account
//return new array of finAssets with updated amount fields
export const withdrawalOutput = (
	finAssets: Array<FinancialAsset>,
	dividends: Array<Dividend>,
	deficit: outputRow,
	start: number,
	end: number,
	period: number
): withdrawal => {
	const outDividend: Map<number, outputRow> = new Map<number, outputRow>();
	const outputWithdrawal: Map<number, withdrawalOutputRow> = new Map<number, withdrawalOutputRow>();

	for (let year = start; year <= end; ++year) {
		let currentDeficit = deficit.amounts.get(year);
		if (currentDeficit == undefined) {
			throw new Error("issue with deficit");
		}
		dividends.forEach((x, index) => {
			let currentOutDividend: outputRow = outDividend.get(x.id);

			if (currentOutDividend == undefined) {
				currentOutDividend = {
					name: x.name,
					note: x.note,
					amounts: new Map<number, number>(),
				};
				outDividend.set(x.id, currentOutDividend);
			}

			const currentAmount: number = dividendCalculation(finAssets, x);
			currentOutDividend.amounts.set(year, currentAmount);
			currentDeficit += currentAmount;
		});

		finAssets
			.sort((a, b) => a.wPriority - b.wPriority)
			.filter((x) => x.totalValue > 0)
			.forEach((x, index) => {
				const toAdd = x;
				let currentOutputWithdrawal: withdrawalOutputRow;

				if (outputWithdrawal.get(x.id) == undefined) {
					currentOutputWithdrawal = {
						name: x.name,
						note: x.note,
						amounts: new Map<number, number>(),
						updatedValue: new Map<number, number>(),
					};
					outputWithdrawal.set(x.id, currentOutputWithdrawal);
				} else currentOutputWithdrawal = outputWithdrawal.get(x.id);

				toAdd.totalValue = compoundGrowthRate(
					toAdd.totalValue,
					toAdd.growthRate,
					year == start ? 0 : period
				);

				if (currentDeficit > 0) {
					toAdd.totalValue -= currentDeficit;
					toAdd.costBasis -= currentDeficit;
					currentOutputWithdrawal.amounts.set(year, currentDeficit);
					currentDeficit = 0;
				} else if (currentDeficit < 0) {
					const postTaxLiquidity = calculatePostTaxLiquidity(toAdd);
					if (postTaxLiquidity <= currentDeficit) {
						toAdd.totalValue = 0;
						toAdd.costBasis = 0;
						currentDeficit -= postTaxLiquidity;
						currentOutputWithdrawal.amounts.set(year, postTaxLiquidity);
					} else {
						const withdrawal = calculateWithdrawal(toAdd, currentDeficit);
						currentDeficit = 0;
						currentOutputWithdrawal.amounts.set(year, withdrawal);
					}
				} else currentOutputWithdrawal.amounts.set(year, 0);

				currentOutputWithdrawal.updatedValue.set(year, toAdd.totalValue);
			});
	}
	return { outputWithdrawal, outDividend };
};
// finAssets
// 	.sort((a, b) => a.wPriority - b.wPriority)
// 	.filter((x) => x.totalValue > 0)
// 	.forEach((x) => {
// 		const toAdd = x;
// 		toAdd.totalValue = compoundGrowthRate(
// 			toAdd.totalValue,
// 			Math.pow(toAdd.growthRate, period),
// 			period
// 		);
// 		if (difference < 0) {
// 			toAdd.totalValue -= difference;
// 			toAdd.costBasis -= difference;
// 			outputWithdrawal.push({ name: x.name, note: x.note, amount: -difference });
// 			difference = 0;
// 		} else if (difference > 0) {
// 			const postTaxLiquidity = calculatePostTaxLiquidity(toAdd);
// 			if (postTaxLiquidity <= difference) {
// 				toAdd.totalValue = 0;
// 				toAdd.costBasis = 0;
// 				difference -= postTaxLiquidity;
// 				outputWithdrawal.push({ name: x.name, note: x.note, amount: postTaxLiquidity });
// 			} else {
// 				const withdrawal = calculateWithdrawal(toAdd, difference);
// 				difference = 0;
// 				outputWithdrawal.push({ name: x.name, note: x.note, amount: withdrawal });
// 			}
// 		}
// 	});
