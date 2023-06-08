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
	end: number,
	rStartMonth: number
): expenseYear => {
	const outputRecurring: Map<number, outputRow> = new Map<number, outputRow>();
	const outputNonRecurring: Map<number, outputRow> = new Map<number, outputRow>();
	const monthlyExpense: outputRow = mkOutputRow("Monthly Expense");
	const annualExpense: outputRow = mkOutputRow("Annual Expense");
	expenses = expenses.filter((x) => x.start.getFullYear() <= end && x.end.getFullYear() >= start);
	for (let i = start; i <= end; ++i) {
		let currentMonthly: number = 0;
		let currentYearly: number = 0;
		expenses.forEach((x) => {
			const recurrence = x.recurrence != Recurrence.NON;
			const map = recurrence ? outputRecurring : outputNonRecurring;
			let row = map.get(x.id);

			if (row == undefined) {
				row = mkOutputRow(x.name, x.note);
				map.set(x.id, row);
			}

			if (!currentYear(x.start.getFullYear(), x.end.getFullYear(), i)) {
				row.amounts.set(i, 0);
				return;
			}

			const toAdd: number = expenseCalculation(x, i);

			if (recurrence) {
				currentMonthly += toAdd;
				currentYearly += annualExpenseCalculation(x, i, toAdd, rStartMonth, start);
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
function annualExpenseCalculation(
	item: BudgetItem,
	year: number,
	expense: number,
	month: number,
	startYear: number = 0
) {
	let monthsActive = 12;
	const itemStartYear = item.start.getFullYear() == year;
	const itemEndYear = item.end.getFullYear() == year;
	if (year != startYear && !itemStartYear && itemEndYear) return monthsActive * expense;
	if (itemEndYear && item.end.getMonth() < month) return 0;
	if (year != startYear)
		monthsActive -=
			(itemStartYear ? item.start.getMonth() : 0) + (itemEndYear ? 11 - item.end.getMonth() : 0);
	else
		monthsActive -=
			(itemStartYear ? (item.start.getMonth() > month ? item.start.getMonth() : month) : 0) +
			(itemEndYear ? 11 - item.end.getMonth() : 0);
	return monthsActive * expense;
}
