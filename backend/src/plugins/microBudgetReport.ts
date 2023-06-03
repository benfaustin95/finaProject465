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
import { expenseMonthOutput } from "./helperFunctions/expenseMonthOutput.js";
import budgetItemRoutes from "../routes/budgetItemRoutes.js";
import { incomeMonthOutput } from "./helperFunctions/incomeMonthOutput.js";
import { expenseMonth, incomeMonth, microYearReport, withdrawal } from "../db/types.js";
import { sendIncomeMonth, sendMonthlyExpenses } from "../helperMethods/destructure.js";

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

function accumulateDeficit(expense: expenseMonth, income: incomeMonth, start: Date, end: Date) {}

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
		return sendIncomeMonth(income);
	};

	app.decorate("microYearReport", microYearOutput);
};

export const FastifyMicroReportsPlugin = fp(microBudgetReport, {
	name: "microBudgetReport",
});
