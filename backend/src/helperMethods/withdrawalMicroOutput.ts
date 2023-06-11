import { FinancialAsset } from "../db/entities/financialasset.js";
import {
	MicroOutputRow,
	MicroWithdrawal,
	MicroWithdrawalOutputRow,
} from "../db/backendTypes/ReportTypes.js";
import { calculateTax } from "./incomeMacroOutput.js";
import { Dividend } from "../db/entities/Dividend.js";
import { compoundGrowthRateIncome, mkMonthOutputRow } from "./incomeMicroOutput.js";

//update finAssets to be current with growth
//create object with the amount withdrawn from each account
//return new array of finAssets with updated amount fields
export const withdrawalMicroOutput = (
	finAssets: Array<FinancialAsset>,
	dividends: Array<Dividend>,
	deficit: MicroOutputRow,
	start: Date,
	end: Date
): MicroWithdrawal => {
	const outDividend: Map<number, MicroOutputRow> = new Map<number, MicroOutputRow>();
	const outputWithdrawal: Map<number, MicroWithdrawalOutputRow> = new Map<
		number,
		MicroWithdrawalOutputRow
	>();
	const remainder: MicroOutputRow = mkMonthOutputRow("remainder", "");

	for (let year = start.getUTCFullYear(); year <= end.getUTCFullYear(); ++year) {
		for (let month = year == start.getUTCFullYear() ? start.getMonth() : 0; month < 12; ++month) {
			const key = JSON.stringify({ month, year });
			let currentDeficit = deficit.amounts.get(key);

			if (currentDeficit == undefined) {
				throw new Error("issue with deficit");
			}
			dividends.forEach((x, index) => {
				let currentOutDividend: MicroOutputRow = outDividend.get(x.id);
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
					let currentOutputWithdrawal: MicroWithdrawalOutputRow = outputWithdrawal.get(x.id);

					if (currentOutputWithdrawal == undefined) {
						currentOutputWithdrawal = {
							name: x.name,
							note: x.note,
							amounts: new Map<string, number>(),
							updatedValue: new Map<string, number>(),
						};
						outputWithdrawal.set(x.id, currentOutputWithdrawal);
					}

					toAdd.totalValue = compoundGrowthRateIncome(
						toAdd.totalValue,
						toAdd.growthRate,
						year == start.getUTCFullYear() && month == start.getMonth() ? 0 : 1 / 12
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

			if (currentDeficit != 0 && remainder.note == "" && year - start.getUTCFullYear() <= 50)
				remainder.note = JSON.stringify(month + "/" + year);
			remainder.amounts.set(key, currentDeficit);
		}
	}
	return { outputWithdrawal, outDividend, remainder };
};
export function dividendCalculation(
	finAssets: Array<FinancialAsset>,
	x: Dividend,
	period = 1
): number {
	const value = finAssets.find((y) => y.id == x.asset.id);
	const income = (x.rate * value.totalValue) / period;
	const tax = calculateTax(
		income,
		x.federal == null ? 0 : x.federal.rate,
		x.state == null ? 0 : x.state.rate,
		x.local == null ? 0 : x.local.rate,
		x.capitalGains == null ? 0 : x.capitalGains.rate,
		x.fica == null ? 0 : x.fica.rate
	);
	return income - (tax.fica + tax.capitalGains + tax.federal + tax.state + tax.local);
}
export function calculatePostTaxLiquidity(item: FinancialAsset) {
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
export function calculateWithdrawal(item: FinancialAsset, difference: number) {
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
