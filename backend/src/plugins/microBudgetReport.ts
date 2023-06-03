import { FastifyInstance } from "fastify";
import { BudgetItem, Recurrence } from "../db/entities/budgetItem.js";
import { CapAsset } from "../db/entities/capasset.js";
import { Dividend } from "../db/entities/Dividend.js";
import { RentalAsset } from "../db/entities/rentalasset.js";
import { FinancialAsset } from "../db/entities/financialasset.js";
import { OneTimeIncome } from "../db/entities/OneTimeIncome.js";
import fp from "fastify-plugin";
import { expenseMonthOutput } from "./helperFunctions/expenseMonthOutput.js";
import { incomeMonthOutput, mkMonthOutputRow } from "./helperFunctions/incomeMonthOutput.js";
import {
	expenseMonth,
	incomeMonth,
	microYearReport,
	monthOutputRow,
	taxAccumulator,
} from "../db/types.js";
import { sendMicroReport } from "../helperMethods/destructure.js";
import { withdrawalMonthOutput } from "./helperFunctions/withdrawalMonthOutput.js";

declare module "fastify" {
	interface FastifyInstance {
		microYearReport: (
			expenses: Array<BudgetItem>,
			capitalAssets: Array<CapAsset>,
			oneTimeIncomes: Array<OneTimeIncome>,
			dividends: Array<Dividend>,
			finAssets: Array<FinancialAsset>,
			rentals: Array<RentalAsset>,
			start: Date,
			end: Date
		) => microYearReport;
	}
}

function sumTaxes(taxAccumulator: taxAccumulator) {
	if (taxAccumulator == undefined) return 0;
	return (
		taxAccumulator.capitalGains +
		taxAccumulator.fica +
		taxAccumulator.federal +
		taxAccumulator.state +
		taxAccumulator.local
	);
}

function accumulateDeficit(
	expense: expenseMonth,
	income: incomeMonth,
	start: Date,
	end: Date
): monthOutputRow {
	const defecit: monthOutputRow = mkMonthOutputRow("defecit");

	for (let year = start.getFullYear(); year <= end.getFullYear(); ++year) {
		for (let month = start.getFullYear() == year ? start.getMonth() : 0; month < 12; ++month) {
			const key = JSON.stringify({ month, year });
			const currentIncome = income.monthlyIncome.amounts.get(key);
			const currentExpense =
				(expense.outReccuring.amounts.get(key) ?? 0) +
				(expense.outNonReccuring.amounts.get(key) ?? 0);
			const currentTax = sumTaxes(income.taxes.get(key));
			defecit.amounts.set(key, currentIncome - (currentTax + currentExpense));
		}
	}
	return defecit;
}

const microBudgetReport = async (app: FastifyInstance, _options = {}) => {
	const microYearOutput = (
		expenses: Array<BudgetItem>,
		capitalAssets: Array<CapAsset>,
		oneTimeIncomes: Array<OneTimeIncome>,
		dividends: Array<Dividend>,
		finAssets: Array<FinancialAsset>,
		rentals: Array<RentalAsset>,
		start: Date,
		end: Date
	) => {
		const expense = expenseMonthOutput(expenses, start, end);
		const income = incomeMonthOutput(capitalAssets, rentals, oneTimeIncomes, start, end);
		const deficit = accumulateDeficit(expense, income, start, end);
		const withdrawal = withdrawalMonthOutput(finAssets, dividends, deficit, start, end);
		return sendMicroReport({ expense, income, deficit, withdrawal });
	};

	app.decorate("microYearReport", microYearOutput);
};

export const FastifyMicroReportsPlugin = fp(microBudgetReport, {
	name: "microBudgetReport",
});
