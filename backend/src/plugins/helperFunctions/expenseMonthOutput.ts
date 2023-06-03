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
			outReccuring.amounts.set(key, 0);
			outNonReccuring.amounts.set(key, 0);

			expenses.forEach((x) => {
				if (!currentYear(x.start.getFullYear(), x.end.getFullYear(), year)) return;
				if (
					(year == x.start.getFullYear() && beforeStartMonth(month, x.start.getMonth())) ||
					(year == x.end.getFullYear() && afterEndMonth(month, x.end.getMonth()))
				)
					return;

				if (x.recurrence != Recurrence.NON)
					outReccuring.amounts.set(
						key,
						outReccuring.amounts.get(key) + expenseCalculation(x, year)
					);
				else
					outNonReccuring.amounts.set(
						key,
						outNonReccuring.amounts.get(key) + expenseCalculation(x, year)
					);
			});
		}
	}
	return { outReccuring, outNonReccuring };
};
