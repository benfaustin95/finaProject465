import { BudgetItem, Recurrence } from "../../db/entities/budgetItem.js";
import { expenseCalculation } from "./expenseYearOutput.js";

export const expenseMonthOutput = (expenses: Array<BudgetItem>, year: number): number => {
	let expenseMonthOut: number = 0;
	expenses.forEach((x) => {
		expenseMonthOut += expenseCalculation(x, year);
	});
	console.log(expenseMonthOut);
	return expenseMonthOut;
};
