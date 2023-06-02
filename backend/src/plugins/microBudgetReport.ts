import { FastifyInstance } from "fastify";
import { BudgetItem, Recurrence } from "../db/entities/budgetItem.js";
import { CapAsset } from "../db/entities/capasset.js";
import { Dividend } from "../db/entities/Dividend.js";
import { RentalAsset } from "../db/entities/rentalasset.js";
import { FinancialAsset } from "../db/entities/financialasset.js";
import { OneTimeIncome } from "../db/entities/OneTimeIncome.js";
import fp from "fastify-plugin";
import { expenseYearOutput } from "./helperFunctions/expenseYearOutput.js";
import { withdrawalOutput } from "./helperFunctions/withdrawalOutput.js";
import { incomeYearOutput } from "./helperFunctions/incomeYearOutput.js";
import { expenseMonthOutput } from "./helperFunctions/expenseMonthOutput.js";
import budgetItemRoutes from "../routes/budgetItemRoutes.js";
import { incomeMonthOutput } from "./helperFunctions/incomeMonthOutput.js";
import { incomeMonth, microYearReport, withdrawal } from "../db/types.js";

declare module "fastify" {
	interface FastifyInstance {
		microYearReport: (
			expenses: Array<BudgetItem>,
			capitalAssets: Array<CapAsset>,
			oneTimeIncomes: Array<OneTimeIncome>,
			dividends: Array<Dividend>,
			finAssets: Array<FinancialAsset>,
			rentals: Array<RentalAsset>,
			year: number
		) => microYearReport;
	}
}

const microBudgetReport = async (app: FastifyInstance, _options = {}) => {
	const microYearOutput = (
		expenses: Array<BudgetItem>,
		capitalAssets: Array<CapAsset>,
		oneTimeIncomes: Array<OneTimeIncome>,
		dividends: Array<Dividend>,
		finAssets: Array<FinancialAsset>,
		rentals: Array<RentalAsset>,
		year: number
	): microYearReport => {
		const expensesByMonth: number[] = new Array(12);
		const incomesByMonth: incomeMonth[] = new Array(12);
		const withdrawalsByMonth: withdrawal[] = new Array(12);

		for (let i = 0; i < 12; ++i) {
			const currentExpenses = expenses.filter((x) => {
				if (x.start.getFullYear() == year && x.start.getMonth() > i) return false;
				return !(x.end.getFullYear() == year && x.end.getMonth() < i);
			});
			const currentCapAsset = capitalAssets.filter((x) => {
				if (x.start.getFullYear() == year && x.start.getMonth() > i) return false;
				return !(x.end.getFullYear() == year && x.end.getMonth() < i);
			});
			const currentOneTimeIncomes = oneTimeIncomes.filter((x) => {
				return x.date.getFullYear() == year && x.date.getMonth() === i;
			});
			expensesByMonth[i] = expenseMonthOutput(currentExpenses, year);
			incomesByMonth[i] = incomeMonthOutput(
				currentCapAsset,
				rentals,
				dividends,
				finAssets,
				currentOneTimeIncomes,
				i,
				year
			);
			// withdrawalsByMonth[i] = withdrawalOutput(
			// 	finAssets,
			// 	incomesByMonth[i].income - expensesByMonth[i],
			// 	1 / 12
			// );
		}
		return { year, expensesByMonth, incomesByMonth, withdrawalsByMonth };
	};
	app.decorate("microYearReport", microYearOutput);
};

export const FastifyMicroReportsPlugin = fp(microBudgetReport, {
	name: "microBudgetReport",
});
