import {
	destructuredExpenseYear,
	destructuredIncomeYear,
	destructuredMacroYearReport,
	destructuredOutputRow,
	destructuredWithdrawal,
	destructuredWithOutputRow,
	expenseYear,
	incomeYear,
	macroYearReport,
	outputRow,
	withdrawal,
	withdrawalOutputRow,
} from "../db/types.js";
import exp from "constants";

function sendRow(outputRow: outputRow): destructuredOutputRow {
	return {
		name: outputRow.name,
		note: outputRow.note,
		amounts: Array.from(outputRow.amounts.entries()),
	};
}

function sendRowGroup(outputRecurring: Map<number, outputRow>): [number, destructuredOutputRow][] {
	const toReturn: Map<number, destructuredOutputRow> = new Map<number, destructuredOutputRow>();
	[...outputRecurring.keys()].forEach((x) => toReturn.set(x, sendRow(outputRecurring.get(x))));
	return Array.from(toReturn.entries());
}

function sendExpenses(expenses: expenseYear): destructuredExpenseYear {
	return {
		outputRecurring: sendRowGroup(expenses.outputRecurring),
		outputNonRecurring: sendRowGroup(expenses.outputNonRecurring),
		monthlyExpense: sendRow(expenses.monthlyExpense),
		annualExpense: sendRow(expenses.annualExpense),
	};
}

function sendIncomes(incomes: incomeYear): destructuredIncomeYear {
	return {
		outHuman: sendRow(incomes.outHuman),
		outSocial: sendRow(incomes.outSocial),
		outNonTaxable: sendRow(incomes.outNonTaxable),
		outRental: sendRow(incomes.outRental),
		outOneTime: sendRow(incomes.outOneTime),
		taxes: Array.from(incomes.taxes.entries()),
	};
}

function sendWithRow(withdrawalOutputRow: withdrawalOutputRow): destructuredWithOutputRow {
	return {
		...sendRow(withdrawalOutputRow),
		updatedValue: Array.from(withdrawalOutputRow.updatedValue.entries()),
	};
}

function sendWithdrawalRow(
	outputWithdrawal: Map<number, withdrawalOutputRow>
): [number, destructuredWithOutputRow][] {
	const toReturn: Map<number, destructuredWithOutputRow> = new Map<
		number,
		destructuredWithOutputRow
	>();
	[...outputWithdrawal.keys()].forEach((x) =>
		toReturn.set(x, sendWithRow(outputWithdrawal.get(x)))
	);
	return Array.from(toReturn.entries());
}

function sendWithdrawals(withdrawals: withdrawal): destructuredWithdrawal {
	return {
		outputWithdrawal: sendWithdrawalRow(withdrawals.outputWithdrawal),
		outDividend: sendRowGroup(withdrawals.outDividend),
	};
}

export function sendMacroReport(toSendBudget: macroYearReport): destructuredMacroYearReport {
	return {
		expenses: sendExpenses(toSendBudget.expenses),
		incomes: sendIncomes(toSendBudget.incomes),
		withdrawals: sendWithdrawals(toSendBudget.withdrawals),
		deficit: sendRow(toSendBudget.deficit),
	};
}
