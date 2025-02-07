import { CapAsset, CapAssetType } from "../db/entities/capasset.js";
import { RentalAsset } from "../db/entities/rentalasset.js";
import { Dividend } from "../db/entities/Dividend.js";
import { FinancialAsset } from "../db/entities/financialasset.js";
import { OneTimeIncome } from "../db/entities/OneTimeIncome.js";
import { Recurrence } from "../db/entities/budgetItem.js";
import { annualExpenseCalculation, currentYear } from "./expenseMacroOutput.js";
import {
	IncomeCalculation,
	MacroIncome,
	MacroOutputRow,
	TaxAccumulator,
	TaxOutput,
} from "../db/backendTypes/ReportTypes.js";
import { compoundGrowthRateIncome, taxAccumulate } from "./incomeMicroOutput.js";

// needs to also return the amount paid in taxes for each income stream
export const incomeMacroOutput = (
	capitalIncomes: Array<CapAsset>,
	rentalIncome: Array<RentalAsset>,
	dividends: Array<Dividend>,
	finAssets: Array<FinancialAsset>,
	oneTime: Array<OneTimeIncome>,
	start: number,
	end: number,
	retirementStartMonth: number
): MacroIncome => {
	const outHuman: MacroOutputRow = mkOutputRow("Salaries");
	const outSocial: MacroOutputRow = mkOutputRow("Social Income");
	const outNonTaxable: MacroOutputRow = mkOutputRow("Non Taxable");
	const outRental: MacroOutputRow = mkOutputRow("Rental Income");
	const outOneTime: MacroOutputRow = mkOutputRow("One Time Incomes");
	const taxes: Map<number, TaxAccumulator> = new Map<number, TaxAccumulator>();

	for (let i = start; i <= end; ++i) {
		let currentHuman = 0;
		let currentSocial = 0;
		let currentNonTax = 0;
		let currentRental = 0;
		let currentOneTime = 0;
		let currentTax = new TaxAccumulator();

		capitalIncomes.forEach((x) => {
			if (!currentYear(x.start.getUTCFullYear(), x.end.getUTCFullYear(), i)) return;

			const toAdd = incomeCalculation(x, i, 1, retirementStartMonth, start);
			currentTax = taxAccumulate(toAdd.tax, currentTax, toAdd.income);

			switch (x.type) {
				case CapAssetType.SOCIAL:
					currentSocial += toAdd.income;
					break;
				case CapAssetType.NONTAXABLEANNUITY:
					currentNonTax += toAdd.income;
					break;
				case CapAssetType.HUMAN:
					currentHuman += toAdd.income;
					break;
			}
		});

		rentalIncome.forEach((x) => {
			const toAdd = rentalCalculation(x, i);
			currentRental += toAdd.income;
			currentTax = taxAccumulate(toAdd.tax, currentTax, toAdd.income);
		});

		oneTime.forEach((x) => {
			if (x.date.getUTCFullYear() != i) return;

			const toAdd = oneTimeCalculation(x, i);
			currentOneTime += toAdd.income;
			currentTax = taxAccumulate(toAdd.tax, currentTax, toAdd.income);
		});

		outHuman.amounts.set(i, currentHuman);
		outSocial.amounts.set(i, currentSocial);
		outNonTaxable.amounts.set(i, currentNonTax);
		outRental.amounts.set(i, currentRental);
		outOneTime.amounts.set(i, currentOneTime);
		taxes.set(i, currentTax);
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
): TaxOutput {
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
export function oneTimeCalculation(x: OneTimeIncome, year: number): IncomeCalculation {
	const income = compoundGrowthRateIncome(
		x.cashBasis,
		x.growthRate,
		year - x.created_at.getUTCFullYear()
	);
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

export function incomeCalculation(
	item: CapAsset,
	year: number,
	period = 1,
	rmonth = 0,
	startYear = 0
): IncomeCalculation {
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
	income = compoundGrowthRateIncome(income, item.growthRate, year - item.start.getUTCFullYear());
	//need to get inflation amount from api and add to growth rate
	if (period == 1) income = annualExpenseCalculation(item, year, income, rmonth, startYear);

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

export function rentalCalculation(item: RentalAsset, year: number, period = 12): IncomeCalculation {
	const income =
		compoundGrowthRateIncome(
			item.grossIncome - item.maintenanceExpense,
			item.growthRate,
			year - item.created_at.getUTCFullYear()
		) * period;
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
export function mkOutputRow(name: string, note: string = ""): MacroOutputRow {
	return {
		name: name,
		note: note,
		amounts: new Map<number, number>(),
	};
}
