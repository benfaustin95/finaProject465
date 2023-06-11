import { FinancialAsset } from "../db/entities/financialasset.js";
import {
	MacroOutputRow,
	MacroWithdrawal,
	MacroWithdrawalOutputRow,
} from "../db/backendTypes/ReportTypes.js";
import { calculateTax, mkOutputRow } from "./incomeMacroOutput.js";
import { Dividend } from "../db/entities/Dividend.js";
import { current } from "tap";
import { compoundGrowthRateIncome } from "./incomeMicroOutput.js";
import {
	calculatePostTaxLiquidity,
	calculateWithdrawal,
	dividendCalculation,
} from "./withdrawalMicroOutput.js";

//update finAssets to be current with growth
//create object with the amount withdrawn from each account
//return new array of finAssets with updated amount fields
export const withdrawalMacroOutput = (
	finAssets: Array<FinancialAsset>,
	dividends: Array<Dividend>,
	deficit: MacroOutputRow,
	start: number,
	end: number
): MacroWithdrawal => {
	const outDividend: Map<number, MacroOutputRow> = new Map<number, MacroOutputRow>();
	const outputWithdrawal: Map<number, MacroWithdrawalOutputRow> = new Map<
		number,
		MacroWithdrawalOutputRow
	>();
	const remainder: MacroOutputRow = mkOutputRow("remainder", "unaccounted for expense");

	for (let year = start; year <= end; ++year) {
		let currentDeficit = deficit.amounts.get(year);
		if (currentDeficit == undefined) {
			throw new Error("issue with deficit");
		}
		dividends.forEach((x, index) => {
			let currentOutDividend: MacroOutputRow = outDividend.get(x.id);

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
			.forEach((x, index) => {
				const toAdd = x;
				let currentOutputWithdrawal: MacroWithdrawalOutputRow = outputWithdrawal.get(x.id);

				if (currentOutputWithdrawal == undefined) {
					currentOutputWithdrawal = {
						name: x.name,
						note: x.note,
						amounts: new Map<number, number>(),
						updatedValue: new Map<number, number>(),
					};
					outputWithdrawal.set(x.id, currentOutputWithdrawal);
				}

				toAdd.totalValue = compoundGrowthRateIncome(
					toAdd.totalValue,
					toAdd.growthRate,
					year == start ? 0 : 1
				);
				if (currentDeficit > 0) {
					toAdd.totalValue += currentDeficit;
					toAdd.costBasis += currentDeficit;
					currentOutputWithdrawal.amounts.set(year, currentDeficit);
					currentDeficit = 0;
				} else if (currentDeficit < 0) {
					const postTaxLiquidity = calculatePostTaxLiquidity(toAdd);
					if (postTaxLiquidity <= -currentDeficit) {
						toAdd.totalValue = 0;
						toAdd.costBasis = 0;
						currentDeficit += postTaxLiquidity;
						currentOutputWithdrawal.amounts.set(year, -postTaxLiquidity);
					} else {
						const withdrawal = calculateWithdrawal(toAdd, currentDeficit);
						currentDeficit = 0;
						currentOutputWithdrawal.amounts.set(year, withdrawal);
					}
				} else currentOutputWithdrawal.amounts.set(year, 0);
				currentOutputWithdrawal.updatedValue.set(year, toAdd.totalValue);
			});
		remainder.amounts.set(year, currentDeficit);
	}
	return { outputWithdrawal, outDividend, remainder };
};
