import { BudgetItem, Recurrence } from "../../db/entities/budgetItem.js";
import { currentYear, expenseCalculation } from "./expenseYearOutput.js";
import { afterEndMonth, beforeStartMonth, mkMonthOutputRow } from "./incomeMonthOutput.js";
import { expenseMonth, monthOutputRow } from "../../db/types.js";

export const expenseMonthOutput = (
	expenses: Array<BudgetItem>,
	start: Date,
	end: Date
): expenseMonth => {
	const outReccuring: monthOutputRow = mkMonthOutputRow("Reccuring Expenses");
	const outNonReccuring: monthOutputRow = mkMonthOutputRow("NonReccuring Expenses");
	for (let year = start.getFullYear(); year <= end.getFullYear(); ++year) {
		for (let month = year == start.getFullYear() ? start.getMonth() : 0; month < 12; ++month) {
			const key: string = JSON.stringify({ month, year });
			let outReccuringCurrent = 0;
			let outNonReccuringCurrent = 0;

			expenses.forEach((x) => {
				if (!currentYear(x.start.getFullYear(), x.end.getFullYear(), year)) return;
				if (
					(year == x.start.getFullYear() && beforeStartMonth(month, x.start.getMonth())) ||
					(year == x.end.getFullYear() && afterEndMonth(month, x.end.getMonth()))
				)
					return;

				if (x.recurrence != Recurrence.NON) outReccuringCurrent += expenseCalculation(x, year);
				else outNonReccuringCurrent += expenseCalculation(x, year);
			});

			outReccuring.amounts.set(key, outReccuringCurrent);
			outNonReccuring.amounts.set(key, outNonReccuringCurrent);
		}
	}
	return { outReccuring, outNonReccuring };
};
