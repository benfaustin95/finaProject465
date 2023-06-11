import { BudgetItem, Recurrence } from "../db/entities/budgetItem.js";
import { currentYear, expenseCalculation } from "./expenseMacroOutput.js";
import { afterEndMonth, beforeStartMonth, mkMonthOutputRow } from "./incomeMicroOutput.js";
import { MicroExpense, MicroOutputRow } from "../db/backendTypes/ReportTypes.js";
import { DestructuredMicroExpense } from "../db/backendTypes/destructureTypes.js";

export const expenseMicroOutput = (
	expenses: Array<BudgetItem>,
	start: Date,
	end: Date
): MicroExpense => {
	const outReoccurring: MicroOutputRow = mkMonthOutputRow("Reoccurring Expenses");
	const outNonReoccurring: MicroOutputRow = mkMonthOutputRow("NonReoccurring Expenses");

	expenses = expenses.filter(
		(x) =>
			x.start.getUTCFullYear() <= end.getUTCFullYear() &&
			x.end.getUTCFullYear() >= start.getUTCFullYear()
	);

	for (let year = start.getUTCFullYear(); year <= end.getUTCFullYear(); ++year) {
		for (let month = year == start.getUTCFullYear() ? start.getMonth() : 0; month < 12; ++month) {
			const key: string = JSON.stringify({ month, year });
			let outReoccurringCurrent = 0;
			let outNonReoccurringCurrent = 0;

			expenses.forEach((x) => {
				if (!currentYear(x.start.getUTCFullYear(), x.end.getUTCFullYear(), year)) return;
				if (
					(year == x.start.getUTCFullYear() && beforeStartMonth(month, x.start.getMonth())) ||
					(year == x.end.getUTCFullYear() && afterEndMonth(month, x.end.getMonth()))
				)
					return;

				if (x.recurrence != Recurrence.NON) outReoccurringCurrent += expenseCalculation(x, year);
				else outNonReoccurringCurrent += expenseCalculation(x, year);
			});

			outReoccurring.amounts.set(key, outReoccurringCurrent);
			outNonReoccurring.amounts.set(key, outNonReoccurringCurrent);
		}
	}
	return { outReoccurring: outReoccurring, outNonReoccurring: outNonReoccurring };
};
