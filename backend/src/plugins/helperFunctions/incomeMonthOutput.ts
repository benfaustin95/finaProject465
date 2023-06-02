import { CapAsset, CapAssetType } from "../../db/entities/capasset.js";
import { RentalAsset } from "../../db/entities/rentalasset.js";
import { Dividend } from "../../db/entities/Dividend.js";
import { FinancialAsset } from "../../db/entities/financialasset.js";
import { OneTimeIncome } from "../../db/entities/OneTimeIncome.js";
import {
	dividendCalculation,
	incomeCalculation,
	oneTimeCalculation,
	rentalCalculation,
} from "./incomeYearOutput.js";
import { incomeMonth, row, taxAccumulator, taxOutput } from "../../db/types.js";

export function freshTaxAccumulator(): taxAccumulator {
	return {
		federal: 0,
		state: 0,
		local: 0,
		capitalGains: 0,
		fica: 0,
		federalIncome: 0,
		stateIncome: 0,
		localIncome: 0,
		capitalGainsIncome: 0,
		ficaIncome: 0,
	};
}

export function taxAccumulate(
	toAdd: taxOutput,
	toAddTo: taxAccumulator,
	income: number
): taxAccumulator {
	if (toAddTo == undefined)
		return {
			federal: toAdd.federal,
			state: toAdd.state,
			local: toAdd.local,
			capitalGains: toAdd.capitalGains,
			fica: toAdd.fica,
			federalIncome: toAdd.federal == 0 ? 0 : income,
			stateIncome: toAdd.state == 0 ? 0 : income,
			localIncome: toAdd.local == 0 ? 0 : income,
			capitalGainsIncome: toAdd.capitalGains == 0 ? 0 : income,
			ficaIncome: toAdd.fica == 0 ? 0 : income,
		};

	return {
		federal: toAdd.federal + toAddTo.federal,
		state: toAdd.state + toAddTo.state,
		local: toAdd.local + toAddTo.local,
		capitalGains: toAdd.capitalGains + toAddTo.capitalGains,
		fica: toAdd.fica + toAddTo.fica,
		federalIncome: toAddTo.federalIncome + (toAdd.federal == 0 ? 0 : income),
		stateIncome: toAddTo.stateIncome + (toAdd.state == 0 ? 0 : income),
		localIncome: toAddTo.localIncome + (toAdd.local == 0 ? 0 : income),
		capitalGainsIncome: toAddTo.capitalGainsIncome + (toAdd.capitalGains == 0 ? 0 : income),
		ficaIncome: toAddTo.fica + (toAdd.fica == 0 ? 0 : income),
	};
}

// needs to also return the amount paid in taxes for each income stream
export const incomeMonthOutput = (
	capitalIncomes: Array<CapAsset>,
	rentalIncomes: Array<RentalAsset>,
	dividends: Array<Dividend>,
	finAssets: Array<FinancialAsset>,
	oneTime: Array<OneTimeIncome>,
	month: number,
	year: number
): incomeMonth => {
	/*
    salary
        human_capital ->human_capital (lineItem)
    investments
        dividends -> dividends (summed)
        rental -> rental (lineItem)
    retirement Income
        social_capital -> social_capital (lineItem)
 */

	const salary: row[] = [];
	const investments: row[] = [];
	const retirementIncome: row[] = [];
	const nonTaxable: row[] = [];
	const oneTimeIncome: row[] = [];
	let taxes = freshTaxAccumulator();
	let income = 0;

	capitalIncomes.forEach((x) => {
		const toAdd = incomeCalculation(x, year);
		switch (x.type) {
			case CapAssetType.HUMAN:
				salary.push({ name: x.name, note: x.note, amount: toAdd.income });
				break;
			case CapAssetType.NONTAXABLEANNUITY:
				nonTaxable.push({ name: x.name, note: x.note, amount: toAdd.income });
				break;
			case CapAssetType.SOCIAL:
				retirementIncome.push({ name: x.name, note: x.note, amount: toAdd.income });
				break;
		}

		taxes = taxAccumulate(toAdd.tax, taxes, toAdd.income);
		income += toAdd.income;
	});

	rentalIncomes.forEach((x) => {
		const toAdd = rentalCalculation(x, year);

		investments.push({ name: x.name, note: x.note, amount: toAdd.income });

		taxes = taxAccumulate(toAdd.tax, taxes, toAdd.income);
		income += toAdd.income;
	});

	oneTime.forEach((x) => {
		const toAdd = oneTimeCalculation(x, year);

		oneTimeIncome.push({ name: x.name, note: x.note, amount: toAdd.income });
		taxes = taxAccumulate(toAdd.tax, taxes, toAdd.income);
		income += toAdd.income;
	});

	return { salary, retirementIncome, nonTaxable, investments, oneTimeIncome, taxes, income };
};
