//Provided with collection of budget items for given year provided
import { BudgetItem, Recurrence } from "../../db/entities/budgetItem.js";
import { amount, expenseYear, outputRow } from "../../db/types.js";
import { mkOutputRow } from "./incomeYearOutput.js";

export const inflation: number = 1.025;
export function compoundGrowthRate(value: number, rate: number, difference: number) {
	return Math.ceil(value * Math.pow(rate == 0 ? 1 : rate * inflation, difference));
}

export function currentYear(fullYear: number, fullYear2: number, i: number) {
	return fullYear <= i && fullYear2 >= i;
}

export const expenseYearOutput = (
	expenses: Array<BudgetItem>,
	start: number,
	end: number
): expenseYear => {
	const outputRecurring: Map<number, outputRow> = new Map<number, outputRow>();
	const outputNonRecurring: Map<number, outputRow> = new Map<number, outputRow>();
	const monthlyExpense: outputRow = mkOutputRow("Monthly Expense");
	const annualExpense: outputRow = mkOutputRow("Annual Expense");

	for (let i = start; i <= end; ++i) {
		let currentMonthly: number = 0;
		let currentYearly: number = 0;
		expenses.forEach((x) => {
			const recurrence = x.recurrence != Recurrence.NON;
			let row;

			if (recurrence)
				row =
					outputRecurring.get(i) == undefined
						? mkOutputRow(x.name, x.note)
						: outputRecurring.get(i);
			else {
				row =
					outputNonRecurring.get(i) == undefined
						? mkOutputRow(x.name, x.note)
						: outputNonRecurring.get(i);
			}

			if (!currentYear(x.start.getFullYear(), x.end.getFullYear(), i)) {
				row.amounts.set(i, 0);
				return;
			}

			const toAdd: number = expenseCalculation(x, i);

			if (recurrence) {
				currentMonthly += toAdd;
				currentYearly += annualExpenseCalculation(x, i, toAdd);
			} else currentYearly += toAdd;

			row.amounts.set(i, toAdd);
		});
		monthlyExpense.amounts.set(i, currentMonthly);
		annualExpense.amounts.set(i, currentYearly);
	}
	return { outputRecurring, outputNonRecurring, monthlyExpense, annualExpense };
};

export const expenseCalculation = (item: BudgetItem, year: number): number => {
	let expense: number;
	switch (item.recurrence) {
		case Recurrence.DAILY:
			expense = Math.ceil(item.amount * 30.437);
			break;
		case Recurrence.WEEKLY:
			expense = Math.ceil(item.amount * 4.3);
			break;
		case Recurrence.MONTHLY:
			expense = Math.ceil(item.amount);
			break;
		case Recurrence.ANNUALLY:
			expense = Math.ceil(item.amount / 12);
			break;
		case Recurrence.NON:
			expense = item.amount;
			break;
	}
	//need to get inflation amount from api and add to growth rate
	return compoundGrowthRate(expense, item.growthRate, year - item.created_at.getFullYear());
};
function annualExpenseCalculation(item: BudgetItem, year: number, expense: number) {
	let monthsActive = 12;
	if (item.start.getFullYear() < year && item.end.getFullYear() > year)
		return monthsActive * expense;
	if (item.start.getFullYear() == year) monthsActive -= item.start.getMonth();
	if (item.end.getFullYear() == year) monthsActive -= 11 - item.end.getMonth();
	return monthsActive * expense;
}
