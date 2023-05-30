import {FastifyInstance} from "fastify";
import {BudgetItem, Recurrence} from "../db/entities/budgetItem.js";
import {CapAsset} from "../db/entities/capasset.js";
import {Dividend} from "../db/entities/Dividend.js";
import {RentalAsset} from "../db/entities/rentalasset.js";
import {FinancialAsset} from "../db/entities/financialasset.js";
import {OneTimeIncome} from "../db/entities/OneTimeIncome.js";
import fp from "fastify-plugin";
import {expenseYearOutput} from "./helperFunctions/expenseYearOutput.js";
import {withdrawalOutput} from "./helperFunctions/withdrawalOutput.js";
import {incomeYearOutput} from "./helperFunctions/incomeYearOutput.js";

declare module "fastify" {
	interface FastifyInstance {
		macroYearOutput: (
			expenses: Array<BudgetItem>,
			capitalAssets: Array<CapAsset>,
			dividends: Array<Dividend>,
			finAssets: Array<FinancialAsset>,
			oneTimeIncomes: Array<OneTimeIncome>,
			rentals: Array<RentalAsset>,
			year: number
		) => { toReturn };
	}
}


const macroBudgetReport = async (app: FastifyInstance, _options = {}) => {
	const macroYearOutput = (
		expenses: Array<BudgetItem>,
		capitalAssets: Array<CapAsset>,
		dividends: Array<Dividend>,
		finAssets: Array<FinancialAsset>,
		oneTimeIncomes: Array<OneTimeIncome>,
		rentals: Array<RentalAsset>,
		year: number
	) => {
		const toReturn = new Object();
		let deficit = 0;
		const expense = expenseYearOutput(expenses, year);
		Object.getOwnPropertyNames(expense).forEach((key) => (toReturn[key] = expense[key]));
		const income = incomeYearOutput(
			capitalAssets,
			rentals,
			dividends,
			finAssets,
			oneTimeIncomes,
			year
		);
		Object.getOwnPropertyNames(income).forEach((key) => {
			toReturn[key] = income[key];
			if (key !== "taxes") deficit -= income[key];
			else deficit += income[key];
		});
		toReturn["deficit"] = -deficit;
		const withdrawal = withdrawalOutput(finAssets, deficit, 1);
		Object.getOwnPropertyNames(withdrawal).forEach((key) => (toReturn[key] = withdrawal[key]));
		return { ...toReturn };
	};

	app.decorate("macroYearOutput", macroYearOutput);
};

export const FastifyMacroReportsPlugin = fp(macroBudgetReport, {
	name: "macroBudgetReport",
});
