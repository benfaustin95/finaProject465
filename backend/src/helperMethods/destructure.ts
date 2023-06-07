import {
	dateKey,
	destructuredExpenseMonth,
	destructuredExpenseYear,
	destructuredIncomeMonth,
	destructuredIncomeYear,
	destructuredMacroYearReport,
	destructuredMicroReport,
	destructuredMicroWithdrawal,
	destructuredMonthlyTaxAccumulator,
	destructuredMonthOutputRow,
	destructuredOutputRow,
	destructuredTaxAccumulator,
	destructuredWithdrawal,
	destructuredWithdrawalMonthOutputRow,
	destructuredWithOutputRow,
	expenseMonth,
	expenseYear,
	incomeMonth,
	incomeYear,
	macroYearReport,
	microMonthReport,
	monthOutputRow,
	outputRow,
	taxAccumulator,
	withdrawal,
	withdrawalMonth,
	withdrawalMonthOutputRow,
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

function sendWithdrawalRows(
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
		outputWithdrawal: sendWithdrawalRows(withdrawals.outputWithdrawal),
		outDividend: sendRowGroup(withdrawals.outDividend),
		remainder: sendRow(withdrawals.remainder),
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

function sendMonthOutputRow(outNonReccuring: monthOutputRow): destructuredMonthOutputRow {
	return {
		name: outNonReccuring.name,
		note: outNonReccuring.note,
		//@ts-ignore
		amounts: Array.from(outNonReccuring.amounts.entries())
			.map(([key, value]) => {
				const parsedKey: dateKey = JSON.parse(key);
				return [[parsedKey.month, parsedKey.year], value];
			})
			.sort((a, b) => {
				if (a[0][1] == b[0][1]) return a[0][0] - b[0][0];
				return a[0][1] - b[0][1];
			}),
	};
}

function sendMonthRowGroup(
	outputRecurring: Map<number, monthOutputRow>
): [number, destructuredMonthOutputRow][] {
	const toReturn: Map<number, destructuredMonthOutputRow> = new Map<
		number,
		destructuredMonthOutputRow
	>();
	[...outputRecurring.keys()].forEach((x) =>
		toReturn.set(x, sendMonthOutputRow(outputRecurring.get(x)))
	);
	return Array.from(toReturn.entries());
}
export function sendMonthlyExpenses(expenses: expenseMonth): destructuredExpenseMonth {
	return {
		outNonRecurring: sendMonthOutputRow(expenses.outNonReccuring),
		outRecurring: sendMonthOutputRow(expenses.outReccuring),
	};
}

function sendMonthTaxes(taxes: Map<string, taxAccumulator>) {
	const toReturn: destructuredMonthlyTaxAccumulator = {
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
		.sort((a, b) => {
			const parsedKeyA: dateKey = JSON.parse(a[0]);
			const parsedKeyB: dateKey = JSON.parse(b[0]);

			if (parsedKeyA.year == parsedKeyB.year) return parsedKeyA.month - parsedKeyB.month;
			return parsedKeyA.year - parsedKeyB.year;
		})
		.forEach(([key, value]) => {
			const keyParsed = JSON.parse(key);
			toReturn.capitalGains = [
				...toReturn.capitalGains,
				[[keyParsed.month, keyParsed.year], value.capitalGains],
			];
			toReturn.capitalGainsIncome = [
				...toReturn.capitalGainsIncome,
				[[keyParsed.month, keyParsed.year], value.capitalGainsIncome],
			];
			toReturn.fica = [...toReturn.fica, [[keyParsed.month, keyParsed.year], value.fica]];
			toReturn.ficaIncome = [
				...toReturn.ficaIncome,
				[[keyParsed.month, keyParsed.year], value.ficaIncome],
			];
			toReturn.federal = [...toReturn.federal, [[keyParsed.month, keyParsed.year], value.federal]];
			toReturn.federalIncome = [
				...toReturn.federalIncome,
				[[keyParsed.month, keyParsed.year], value.federalIncome],
			];
			toReturn.state = [...toReturn.state, [[keyParsed.month, keyParsed.year], value.state]];
			toReturn.stateIncome = [
				...toReturn.stateIncome,
				[[keyParsed.month, keyParsed.year], value.stateIncome],
			];
			toReturn.local = [...toReturn.local, [[keyParsed.month, keyParsed.year], value.local]];
			toReturn.localIncome = [
				...toReturn.localIncome,
				[[keyParsed.month, keyParsed.year], value.localIncome],
			];
		});

	return toReturn;
}

export function sendIncomeMonth(income: incomeMonth): destructuredIncomeMonth {
	return {
		salary: sendMonthRowGroup(income.salary),
		investments: sendMonthRowGroup(income.investments),
		retirementIncome: sendMonthRowGroup(income.retirementIncome),
		nonTaxable: sendMonthRowGroup(income.nonTaxable),
		oneTimeIncome: sendMonthRowGroup(income.oneTimeIncome),
		taxes: sendMonthTaxes(income.taxes),
		monthlyIncome: sendMonthOutputRow(income.monthlyIncome),
	};
}

function sendWithMonthOutputRow(
	withdrawalMonthOutputRow: withdrawalMonthOutputRow
): destructuredWithdrawalMonthOutputRow {
	return {
		...sendMonthOutputRow(withdrawalMonthOutputRow),
		updatedValue: Array.from(withdrawalMonthOutputRow.updatedValue.entries()).map(
			([key, value]) => {
				const parsedKey: dateKey = JSON.parse(key);
				return [[parsedKey.month, parsedKey.year], value];
			}
		),
	};
}

function sendWithMonthRows(
	outputWithdrawal: Map<number, withdrawalMonthOutputRow>
): [number, destructuredWithdrawalMonthOutputRow][] {
	return Array.from(outputWithdrawal.entries()).map(([key, value]) => {
		return [key, sendWithMonthOutputRow(value)];
	});
}

function sendWithdrawalMonth(withdrawal: withdrawalMonth): destructuredMicroWithdrawal {
	return {
		outputWithdrawal: sendWithMonthRows(withdrawal.outputWithdrawal),
		outDividend: sendMonthRowGroup(withdrawal.outDividend),
		remainder: sendMonthOutputRow(withdrawal.remainder),
	};
}

export function sendMicroReport(report: microMonthReport): destructuredMicroReport {
	return {
		expense: sendMonthlyExpenses(report.expense),
		income: sendIncomeMonth(report.income),
		deficit: sendMonthOutputRow(report.deficit),
		withdrawal: sendWithdrawalMonth(report.withdrawal),
	};
}
