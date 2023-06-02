import { CapAsset, CapAssetType } from "../../db/entities/capasset.js";
import { RentalAsset } from "../../db/entities/rentalasset.js";
import { Dividend } from "../../db/entities/Dividend.js";
import { FinancialAsset } from "../../db/entities/financialasset.js";
import { OneTimeIncome } from "../../db/entities/OneTimeIncome.js";
import { Recurrence } from "../../db/entities/budgetItem.js";
import { compoundGrowthRate, currentYear } from "./expenseYearOutput.js";
import {
	incomeCalculation,
	incomeYear,
	outputRow,
	taxAccumulator,
	taxOutput,
} from "../../db/types.js";
import { taxAccumulate } from "./incomeMonthOutput.js";

export function mkOutputRow(name: string, note: string = ""): outputRow {
	return {
		name: name,
		note: note,
		amounts: new Map<number, number>(),
	};
}

// needs to also return the amount paid in taxes for each income stream
export const incomeYearOutput = (
	capitalIncomes: Array<CapAsset>,
	rentalIncome: Array<RentalAsset>,
	dividends: Array<Dividend>,
	finAssets: Array<FinancialAsset>,
	oneTime: Array<OneTimeIncome>,
	start: number,
	end: number
): incomeYear => {
	const outHuman: outputRow = {
		name: "Salaries",
		note: "",
		amounts: new Map<number, number>(),
	};
	const outSocial: outputRow = mkOutputRow("Social Income");
	const outNonTaxable: outputRow = mkOutputRow("Non Taxable");
	const outRental: outputRow = mkOutputRow("Rental Income");
	const outOneTime: outputRow = mkOutputRow("One Time Incomes");
	const taxes: Map<number, taxAccumulator> = new Map<number, taxAccumulator>();

	for (let i = start; i <= end; ++i) {
		let taxYear = new taxAccumulator();
		capitalIncomes.forEach((x) => {
			let row: outputRow;

			switch (x.type) {
				case CapAssetType.SOCIAL:
					row = outSocial;
					break;
				case CapAssetType.NONTAXABLEANNUITY:
					row = outNonTaxable;
					break;
				case CapAssetType.HUMAN:
					row = outHuman;
					break;
			}

			const current = row.amounts.get(i);
			if (!currentYear(x.start.getFullYear(), x.end.getFullYear(), i)) {
				row.amounts.set(i, current == undefined ? 0 : current);
				return;
			}

			const toAdd = incomeCalculation(x, i);
			row.amounts.set(i, current == undefined ? toAdd.income : current + toAdd.income);
			taxYear = taxAccumulate(toAdd.tax, taxYear, toAdd.income);
		});

		rentalIncome.forEach((x) => {
			const current = outRental.amounts.get(i);
			const toAdd = rentalCalculation(x, i);
			outRental.amounts.set(i, current == undefined ? toAdd.income : current + toAdd.income);
			taxYear = taxAccumulate(toAdd.tax, taxYear, toAdd.income);
		});

		oneTime.forEach((x) => {
			const current = outOneTime.amounts.get(i);
			const toAdd = oneTimeCalculation(x, i);
			outOneTime.amounts.set(i, current == undefined ? toAdd.income : current + toAdd.income);
			taxYear = taxAccumulate(toAdd.tax, taxYear, toAdd.income);
		});

		taxes.set(i, taxYear);
	}
	return { outHuman, outSocial, outNonTaxable, outRental, outOneTime, taxes };
};
export function calculateTax(
	income: number,
	federal: number,
	state: number,
	local: number,
	capitalGains: number,
	fica: number
): taxOutput {
	return {
		federal: Math.ceil(income * federal),
		state: Math.ceil(income * state),
		local: Math.ceil(income * local),
		capitalGains: Math.ceil(income * capitalGains),
		fica: Math.ceil(income * fica),
	};
}
//assume rental income is update for withdrawals from previous years in array of assets passed in/
// assumption remains the same for fin assets used to calculate dividends
export function oneTimeCalculation(x: OneTimeIncome, year: number): incomeCalculation {
	const income =
		x.date.getFullYear() == year
			? compoundGrowthRate(x.cashBasis, x.growthRate, year - x.created_at.getFullYear())
			: 0;
	const tax = calculateTax(
		income,
		x.federal == null ? 0 : x.federal.rate,
		x.state == null ? 0 : x.state.rate,
		x.local == null ? 0 : x.local.rate,
		x.capitalGains == null ? 0 : x.capitalGains.rate,
		x.fica == null ? 0 : x.fica.rate
	);
	return { income, tax };
}

export function dividendCalculation(finAssets: Array<FinancialAsset>, x: Dividend): number {
	const value = finAssets.find((y) => y.id == x.asset.id);
	const income = x.rate * value.totalValue;
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
export function incomeCalculation(item: CapAsset, year: number): incomeCalculation {
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
			income = item.income / 12;
			break;
		case Recurrence.NON:
			income = item.income;
			break;
	}
	//need to get inflation amount from api and add to growth rate
	income = annualIncomeCalculation(
		item,
		year,
		compoundGrowthRate(income, item.growthRate, year - item.start.getFullYear())
	);
	const tax = calculateTax(
		income,
		item.federal == null ? 0 : item.federal.rate,
		item.state == null ? 0 : item.state.rate,
		item.local == null ? 0 : item.local.rate,
		item.capitalGains == null ? 0 : item.capitalGains.rate,
		item.fica == null ? 0 : item.fica.rate
	);
	return { income, tax };
}

export function rentalCalculation(item: RentalAsset, year: number): incomeCalculation {
	const income =
		compoundGrowthRate(
			item.grossIncome - item.maintenanceExpense,
			item.growthRate,
			year - item.created_at.getFullYear()
		) * 12;
	console.log(item.name, " ", income);
	const tax = calculateTax(
		income,
		item.federal == null ? 0 : item.federal.rate,
		item.state == null ? 0 : item.state.rate,
		item.local == null ? 0 : item.local.rate,
		item.capitalGains == null ? 0 : item.capitalGains.rate,
		item.fica == null ? 0 : item.fica.rate
	);
	return { income, tax };
}
function annualIncomeCalculation(item: CapAsset, year: number, income: number) {
	let monthsActive = 12;
	if (item.start.getFullYear() < year && item.end.getFullYear() > year)
		return monthsActive * income;
	if (item.start.getFullYear() == year) monthsActive -= item.start.getMonth();
	if (item.end.getFullYear() == year) monthsActive -= 11 - item.end.getMonth();

	return monthsActive * income;
}
