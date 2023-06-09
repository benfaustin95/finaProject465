import { FastifyInstance } from "fastify";
import { BudgetItem, Recurrence } from "../db/entities/budgetItem.js";
import { CapAsset } from "../db/entities/capasset.js";
import { Dividend } from "../db/entities/Dividend.js";
import { RentalAsset } from "../db/entities/rentalasset.js";
import { FinancialAsset } from "../db/entities/financialasset.js";
import { OneTimeIncome } from "../db/entities/OneTimeIncome.js";
import fp from "fastify-plugin";
import { expenseYearOutput } from "./helperFunctions/expenseYearOutput.js";
import { withdrawalYearOutput } from "./helperFunctions/withdrawalYearOutput.js";
import { incomeYearOutput } from "./helperFunctions/incomeYearOutput.js";
import {
	expenseYear,
	incomeYear,
	macroYearReport,
	outputRow,
	taxAccumulator,
} from "../db/types.js";

declare module "fastify" {
	interface FastifyInstance {
		macroYearOutput: (
			expenses: Array<BudgetItem>,
			capitalAssets: Array<CapAsset>,
			dividends: Array<Dividend>,
			finAssets: Array<FinancialAsset>,
			oneTimeIncomes: Array<OneTimeIncome>,
			rentals: Array<RentalAsset>,
			start: number,
			end: number,
			rStartMonth: number
		) => macroYearReport;
	}
}

function accumulateDeficit(
	expense: expenseYear,
	income: incomeYear,
	start: number,
	end: number
): outputRow {
	const yearlyExpense = expense.annualExpense;
	const yearlyHuman = income.outHuman;
	const yearlySocial = income.outSocial;
	const yearlyNonTax = income.outNonTaxable;
	const yearlyRental = income.outRental;
	const yearlyOneTime = income.outOneTime;
	const yearlyTaxes = income.taxes;

	const deficit: outputRow = {
		name: "deficit",
		note: "",
		amounts: new Map<number, number>(),
	};

	for (let year = start; year <= end; ++year) {
		const tempExpense = yearlyExpense.amounts.get(year);
		const tempIncome = yearSummation(
			yearlyHuman.amounts.get(year),
			yearlySocial.amounts.get(year),
			yearlyNonTax.amounts.get(year),
			yearlyRental.amounts.get(year),
			yearlyOneTime.amounts.get(year),
			yearlyTaxes.get(year)
		);
		deficit.amounts.set(year, tempIncome - tempExpense);
	}
	return deficit;
}

function yearSummation(
	income1: number,
	income2: number,
	income3: number,
	income4: number,
	income5: number,
	taxes: taxAccumulator
) {
	const toReturn = income1 + income2 + income3 + income4 + income5;
	return toReturn - (taxes.capitalGains + taxes.federal + taxes.state + taxes.local + taxes.fica);
}
const macroBudgetReport = async (app: FastifyInstance, _options = {}) => {
	const macroYearOutput = (
		expenses: Array<BudgetItem>,
		capitalAssets: Array<CapAsset>,
		dividends: Array<Dividend>,
		finAssets: Array<FinancialAsset>,
		oneTimeIncomes: Array<OneTimeIncome>,
		rentals: Array<RentalAsset>,
		start: number,
		end: number,
		rStartMonth: number
	): macroYearReport => {
		const expense = expenseYearOutput(expenses, start, end, rStartMonth);
		const income = incomeYearOutput(
			capitalAssets,
			rentals,
			dividends,
			finAssets,
			oneTimeIncomes,
			start,
			end
		);

		const deficit = accumulateDeficit(expense, income, start, end);
		const withdrawal = withdrawalYearOutput(finAssets, dividends, deficit, start, end, 1);
		return { expenses: expense, incomes: income, deficit, withdrawals: withdrawal };
		// incomes: income, withdrawals: withdrawal, deficit };
	};
	app.decorate("macroYearOutput", macroYearOutput);
};

export const FastifyMacroReportsPlugin = fp(macroBudgetReport, {
	name: "macroBudgetReport",
});
