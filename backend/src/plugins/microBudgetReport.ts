import { FastifyInstance } from "fastify";
import { BudgetItem, Recurrence } from "../db/entities/budgetItem.js";
import { CapAsset } from "../db/entities/capasset.js";
import { Dividend } from "../db/entities/Dividend.js";
import { RentalAsset } from "../db/entities/rentalasset.js";
import { FinancialAsset } from "../db/entities/financialasset.js";
import { OneTimeIncome } from "../db/entities/OneTimeIncome.js";
import fp from "fastify-plugin";
import { expenseMicroOutput } from "../helperMethods/expenseMicroOutput.js";
import { incomeMicroOutput, mkMonthOutputRow } from "../helperMethods/incomeMicroOutput.js";
import {
	MicroExpense,
	MicroIncome,
	MicroOutputRow,
	TaxAccumulator,
} from "../db/backendTypes/ReportTypes.js";
import { sendMicroReport } from "../helperMethods/destructure.js";
import { withdrawalMicroOutput } from "../helperMethods/withdrawalMicroOutput.js";
import { start } from "repl";
import { end } from "tap";
import { DestructuredMicroReport } from "../db/backendTypes/destructureTypes.js";

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
		) => DestructuredMicroReport;
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
		start: Date,
		end: Date
	): DestructuredMicroReport => {
		const expense = expenseMicroOutput(expenses, start, end);
		const income = incomeMicroOutput(capitalAssets, rentals, oneTimeIncomes, start, end);
		const deficit = accumulateDeficit(expense, income, start, end);
		const withdrawal = withdrawalMicroOutput(finAssets, dividends, deficit, start, end);
		return sendMicroReport({ expense, income, deficit, withdrawal });
	};

	app.decorate("microYearReport", microYearOutput);
};

export const FastifyMicroReportsPlugin = fp(microBudgetReport, {
	name: "microBudgetReport",
});

function sumTaxes(taxAccumulator: TaxAccumulator) {
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
	expense: MicroExpense,
	income: MicroIncome,
	start: Date,
	end: Date
): MicroOutputRow {
	const deficit: MicroOutputRow = mkMonthOutputRow("deficit");

	for (let year = start.getFullYear(); year <= end.getFullYear(); ++year) {
		for (let month = start.getFullYear() == year ? start.getMonth() : 0; month < 12; ++month) {
			const key = JSON.stringify({ month, year });
			const currentIncome = income.monthlyIncome.amounts.get(key);
			const currentExpense =
				(expense.outReoccurring.amounts.get(key) ?? 0) +
				(expense.outNonReoccurring.amounts.get(key) ?? 0);
			const currentTax = sumTaxes(income.taxes.get(key));
			deficit.amounts.set(key, currentIncome - (currentTax + currentExpense));
		}
	}
	return deficit;
}
