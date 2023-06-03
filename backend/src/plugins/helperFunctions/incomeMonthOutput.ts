import { CapAsset, CapAssetType } from "../../db/entities/capasset.js";
import { RentalAsset } from "../../db/entities/rentalasset.js";
import { OneTimeIncome } from "../../db/entities/OneTimeIncome.js";
import { incomeCalculation, oneTimeCalculation, rentalCalculation } from "./incomeYearOutput.js";
import { incomeMonth, monthOutputRow, taxAccumulator, taxOutput } from "../../db/types.js";
import { currentYear } from "./expenseYearOutput.js";

export function mkMonthOutputRow(name: string, note: string = ""): monthOutputRow {
	return {
		name: name,
		note: note,
		amounts: new Map<string, number>(),
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

export function beforeStartMonth(month: number, month1: number) {
	return month < month1;
}

export function afterEndMonth(month: number, month1: number) {
	return month > month1;
}

// needs to also return the amount paid in taxes for each income stream
export const incomeMonthOutput = (
	capitalIncomes: Array<CapAsset>,
	rentalIncomes: Array<RentalAsset>,
	oneTime: Array<OneTimeIncome>,
	start: Date,
	end: Date
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

	const salary: Map<number, monthOutputRow> = new Map<number, monthOutputRow>();
	const investments: Map<number, monthOutputRow> = new Map<number, monthOutputRow>();
	const retirementIncome: Map<number, monthOutputRow> = new Map<number, monthOutputRow>();
	const nonTaxable: Map<number, monthOutputRow> = new Map<number, monthOutputRow>();
	const oneTimeIncome: Map<number, monthOutputRow> = new Map<number, monthOutputRow>();
	const taxes: Map<string, taxAccumulator> = new Map<string, taxAccumulator>();
	const monthlyIncome: monthOutputRow = mkMonthOutputRow("monthly income");

	capitalIncomes.forEach((x) => {
		let currentMap: Map<number, monthOutputRow>;

		switch (x.type) {
			case CapAssetType.HUMAN:
				currentMap = salary;
				break;
			case CapAssetType.NONTAXABLEANNUITY:
				currentMap = nonTaxable;
				break;
			case CapAssetType.SOCIAL:
				currentMap = retirementIncome;
				break;
		}

		let currentItem = currentMap.get(x.id);

		if (currentItem == undefined) {
			currentItem = mkMonthOutputRow(x.name, x.note);
			currentMap.set(x.id, currentItem);
		}

		for (let year = start.getFullYear(); year <= end.getFullYear(); ++year) {
			const toAdd = incomeCalculation(x, year, 0);
			for (let month = year == start.getFullYear() ? start.getMonth() : 0; month < 12; ++month) {
				const key = JSON.stringify({ month, year });
				let currentMonthIncome = monthlyIncome.amounts.get(key);
				if (currentMonthIncome == undefined) currentMonthIncome = 0;

				if (
					!currentYear(x.start.getFullYear(), x.end.getFullYear(), year) ||
					(year == x.start.getFullYear() && beforeStartMonth(month, x.start.getMonth())) ||
					(year == x.end.getFullYear() && afterEndMonth(month, x.end.getMonth()))
				) {
					currentItem.amounts.set(key, 0);
					monthlyIncome.amounts.set(key, currentMonthIncome);
					continue;
				}

				currentItem.amounts.set(key, toAdd.income);
				monthlyIncome.amounts.set(key, currentMonthIncome + toAdd.income);
				taxes.set(key, taxAccumulate(toAdd.tax, taxes.get(key), toAdd.income));
			}
		}
	});

	rentalIncomes.forEach((x) => {
		let currentItem = investments.get(x.id);

		if (currentItem == undefined) {
			currentItem = mkMonthOutputRow(x.name, x.note);
			investments.set(x.id, currentItem);
		}

		for (let year = start.getFullYear(); year <= end.getFullYear(); ++year) {
			const toAdd = rentalCalculation(x, year, 1);
			for (let month = year == start.getFullYear() ? start.getMonth() : 0; month < 12; ++month) {
				const key = JSON.stringify({ month, year });
				let currentMonthIncome = monthlyIncome.amounts.get(key);
				if (currentMonthIncome == undefined) currentMonthIncome = 0;

				currentItem.amounts.set(key, toAdd.income);
				monthlyIncome.amounts.set(key, currentMonthIncome + toAdd.income);
				taxes.set(key, taxAccumulate(toAdd.tax, taxes.get(key), toAdd.income));
			}
		}
	});

	oneTime.forEach((x) => {
		let currentItem = oneTimeIncome.get(x.id);
		if (currentItem == undefined) {
			currentItem = mkMonthOutputRow(x.name, x.note);
			oneTimeIncome.set(x.id, currentItem);
		}

		for (let year = start.getFullYear(); year <= end.getFullYear(); ++year) {
			const toAdd = oneTimeCalculation(x, year);
			for (let month = year == start.getFullYear() ? start.getMonth() : 0; month < 12; ++month) {
				const key = JSON.stringify({ month, year });
				let currentMonthIncome = monthlyIncome.amounts.get(key);
				if (currentMonthIncome == undefined) currentMonthIncome = 0;

				if (x.date.getFullYear() != year || x.date.getMonth() != month) {
					monthlyIncome.amounts.set(key, currentMonthIncome);
					currentItem.amounts.set(key, 0);
					continue;
				}
				currentItem.amounts.set(key, toAdd.income);
				monthlyIncome.amounts.set(key, currentMonthIncome + toAdd.income);
				taxes.set(key, taxAccumulate(toAdd.tax, taxes.get(key), toAdd.income));
			}
		}
	});
	return { salary, investments, retirementIncome, nonTaxable, oneTimeIncome, taxes, monthlyIncome };
};
