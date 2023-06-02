import {
	destructuredExpenseYear,
	destructuredIncomeYear,
	destructuredMacroYearReport,
	destructuredOutputRow,
	destructuredTaxAccumulator,
	destructuredWithdrawal,
	destructuredWithOutputRow,
	expenseYear,
	incomeYear,
	macroYearReport,
	outputRow,
	taxAccumulator,
	withdrawal,
	withdrawalOutputRow,
} from "../db/types.js";
import exp from "constants";

function sendRow(outputRow: outputRow): destructuredOutputRow {
	return {
		name: outputRow.name,
		note: outputRow.note,
		amounts: Array.from(outputRow.amounts.entries()).sort((x, y) => {
			return x[0] - y[0];
		}),
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

function sendTaxes(taxes: Map<number, taxAccumulator>) {
	const toReturn: destructuredTaxAccumulator = {
		capitalGains: [],
		fica: [],
		federal: [],
		state: [],
		local: [],
		capitalGainsIncome: [],
		ficaIncome: [],
		federalIncome: [],
		stateIncome: [],
		localIncome: [],
	};
	Array.from(taxes.entries())
		.sort((x, y) => x[0] - y[0])
		.forEach(([year, value]) => {
			toReturn.capitalGains = [...toReturn.capitalGains, [year, value.capitalGains]];
			toReturn.capitalGainsIncome = [
				...toReturn.capitalGainsIncome,
				[year, value.capitalGainsIncome],
			];
			toReturn.fica = [...toReturn.fica, [year, value.fica]];
			toReturn.ficaIncome = [...toReturn.ficaIncome, [year, value.ficaIncome]];
			toReturn.federal = [...toReturn.federal, [year, value.federal]];
			toReturn.federalIncome = [...toReturn.federalIncome, [year, value.federalIncome]];
			toReturn.state = [...toReturn.state, [year, value.state]];
			toReturn.stateIncome = [...toReturn.stateIncome, [year, value.stateIncome]];
			toReturn.local = [...toReturn.local, [year, value.local]];
			toReturn.localIncome = [...toReturn.localIncome, [year, value.localIncome]];
		});

	return toReturn;
}

function sendIncomes(incomes: incomeYear): destructuredIncomeYear {
	return {
		outHuman: sendRow(incomes.outHuman),
		outSocial: sendRow(incomes.outSocial),
		outNonTaxable: sendRow(incomes.outNonTaxable),
		outRental: sendRow(incomes.outRental),
		outOneTime: sendRow(incomes.outOneTime),
		taxes: sendTaxes(incomes.taxes),
	};
}

function sendWithRow(withdrawalOutputRow: withdrawalOutputRow): destructuredWithOutputRow {
	return {
		...sendRow(withdrawalOutputRow),
		updatedValue: Array.from(withdrawalOutputRow.updatedValue.entries()).sort(
			(x, y) => x[0] - y[0]
		),
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
