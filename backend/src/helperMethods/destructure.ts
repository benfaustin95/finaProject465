import {
	DateKey,
	MicroExpense,
	MacroExpense,
	MicroIncome,
	MacroIncome,
	MacroReport,
	MicroReport,
	MicroOutputRow,
	MacroOutputRow,
	TaxAccumulator,
	MacroWithdrawal,
	MicroWithdrawal,
	MicroWithdrawalOutputRow,
	MacroWithdrawalOutputRow,
} from "../db/backendTypes/ReportTypes.js";
import {
	DestructuredMacroExpense,
	DestructuredMacroIncome,
	DestructuredMacroOutputRow,
	DestructuredMacroReport,
	DestructuredMacroWithdrawal,
	DestructuredMicroExpense,
	DestructuredMicroIncome,
	DestructuredMicroOutputRow,
	DestructuredMicroReport,
	DestructuredMicroTaxAccumulator,
	DestructuredMicroWithdrawal,
	DestructuredMicroWithdrawalOutputRow,
	DestructuredTaxAccumulator,
	DestructuredWithMacroOutputRow,
} from "../db/backendTypes/destructureTypes.js";

//Destructures maps that need to be sent via HTTP because I am an idiot and didn't
// think about the fact that a MAP can not be sent.
function sendMacroOutputRow(outputRow: MacroOutputRow): DestructuredMacroOutputRow {
	return {
		name: outputRow.name,
		note: outputRow.note,
		amounts: Array.from(outputRow.amounts.entries()).sort((x, y) => {
			return x[0] - y[0];
		}),
	};
}

function sendMacroRowGroup(
	outputRecurring: Map<number, MacroOutputRow>
): [number, DestructuredMacroOutputRow][] {
	const toReturn: Map<number, DestructuredMacroOutputRow> = new Map<
		number,
		DestructuredMacroOutputRow
	>();
	[...outputRecurring.keys()].forEach((x) =>
		toReturn.set(x, sendMacroOutputRow(outputRecurring.get(x)))
	);
	return Array.from(toReturn.entries());
}

function sendMacroExpense(expenses: MacroExpense): DestructuredMacroExpense {
	return {
		outputRecurring: sendMacroRowGroup(expenses.outputRecurring),
		outputNonRecurring: sendMacroRowGroup(expenses.outputNonRecurring),
		monthlyExpense: sendMacroOutputRow(expenses.monthlyExpense),
		annualExpense: sendMacroOutputRow(expenses.annualExpense),
	};
}

function sendMacroTaxes(taxes: Map<number, TaxAccumulator>) {
	const toReturn: DestructuredTaxAccumulator = {
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

function sendMacroIncome(incomes: MacroIncome): DestructuredMacroIncome {
	return {
		outHuman: sendMacroOutputRow(incomes.outHuman),
		outSocial: sendMacroOutputRow(incomes.outSocial),
		outNonTaxable: sendMacroOutputRow(incomes.outNonTaxable),
		outRental: sendMacroOutputRow(incomes.outRental),
		outOneTime: sendMacroOutputRow(incomes.outOneTime),
		taxes: sendMacroTaxes(incomes.taxes),
	};
}

function sendWithMacroOutputRow(
	withdrawalOutputRow: MacroWithdrawalOutputRow
): DestructuredWithMacroOutputRow {
	return {
		...sendMacroOutputRow(withdrawalOutputRow),
		updatedValue: Array.from(withdrawalOutputRow.updatedValue.entries()).sort(
			(x, y) => x[0] - y[0]
		),
	};
}

function sendMacroWithdrawalRowGroup(
	outputWithdrawal: Map<number, MacroWithdrawalOutputRow>
): [number, DestructuredWithMacroOutputRow][] {
	return [...outputWithdrawal.entries()].map(([key, value]) => [
		key,
		sendWithMacroOutputRow(value),
	]);
}

function sendMacroWithdrawal(withdrawals: MacroWithdrawal): DestructuredMacroWithdrawal {
	return {
		outputWithdrawal: sendMacroWithdrawalRowGroup(withdrawals.outputWithdrawal),
		outDividend: sendMacroRowGroup(withdrawals.outDividend),
		remainder: sendMacroOutputRow(withdrawals.remainder),
	};
}

export function sendMacroReport(toSendBudget: MacroReport): DestructuredMacroReport {
	return {
		expenses: sendMacroExpense(toSendBudget.expenses),
		incomes: sendMacroIncome(toSendBudget.incomes),
		withdrawals: sendMacroWithdrawal(toSendBudget.withdrawals),
		deficit: sendMacroOutputRow(toSendBudget.deficit),
	};
}

function sendMicroOutputRow(outNonReccuring: MicroOutputRow): DestructuredMicroOutputRow {
	return {
		name: outNonReccuring.name,
		note: outNonReccuring.note,
		//@ts-ignore
		amounts: Array.from(outNonReccuring.amounts.entries())
			.map(([key, value]) => {
				const parsedKey: DateKey = JSON.parse(key);
				return [[parsedKey.month, parsedKey.year], value];
			})
			.sort((a, b) => {
				if (a[0][1] == b[0][1]) return a[0][0] - b[0][0];
				return a[0][1] - b[0][1];
			}),
	};
}

function sendMicroRowGroup(
	outputRecurring: Map<number, MicroOutputRow>
): [number, DestructuredMicroOutputRow][] {
	return [...outputRecurring.entries()].map(([key, value]) => {
		return [key, sendMicroOutputRow(value)];
	});
}
export function sendMonthlyExpenses(expenses: MicroExpense): DestructuredMicroExpense {
	return {
		outNonRecurring: sendMicroOutputRow(expenses.outNonReoccurring),
		outRecurring: sendMicroOutputRow(expenses.outReoccurring),
	};
}

function sendMicroTaxes(taxes: Map<string, TaxAccumulator>) {
	const toReturn: DestructuredMicroTaxAccumulator = {
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
			const parsedKeyA: DateKey = JSON.parse(a[0]);
			const parsedKeyB: DateKey = JSON.parse(b[0]);

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

export function sendMicroIncome(income: MicroIncome): DestructuredMicroIncome {
	return {
		salary: sendMicroRowGroup(income.salary),
		investments: sendMicroRowGroup(income.investments),
		retirementIncome: sendMicroRowGroup(income.retirementIncome),
		nonTaxable: sendMicroRowGroup(income.nonTaxable),
		oneTimeIncome: sendMicroRowGroup(income.oneTimeIncome),
		taxes: sendMicroTaxes(income.taxes),
		monthlyIncome: sendMicroOutputRow(income.monthlyIncome),
	};
}

function sendMicroWithOutputRow(
	withdrawalMonthOutputRow: MicroWithdrawalOutputRow
): DestructuredMicroWithdrawalOutputRow {
	return {
		...sendMicroOutputRow(withdrawalMonthOutputRow),
		updatedValue: Array.from(withdrawalMonthOutputRow.updatedValue.entries()).map(
			([key, value]) => {
				const parsedKey: DateKey = JSON.parse(key);
				return [[parsedKey.month, parsedKey.year], value];
			}
		),
	};
}

function sendMicroWithRowGroup(
	outputWithdrawal: Map<number, MicroWithdrawalOutputRow>
): [number, DestructuredMicroWithdrawalOutputRow][] {
	return Array.from(outputWithdrawal.entries()).map(([key, value]) => {
		return [key, sendMicroWithOutputRow(value)];
	});
}

function sendMicroWithdrawal(withdrawal: MicroWithdrawal): DestructuredMicroWithdrawal {
	return {
		outputWithdrawal: sendMicroWithRowGroup(withdrawal.outputWithdrawal),
		outDividend: sendMicroRowGroup(withdrawal.outDividend),
		remainder: sendMicroOutputRow(withdrawal.remainder),
	};
}

export function sendMicroReport(report: MicroReport): DestructuredMicroReport {
	return {
		expense: sendMonthlyExpenses(report.expense),
		income: sendMicroIncome(report.income),
		deficit: sendMicroOutputRow(report.deficit),
		withdrawal: sendMicroWithdrawal(report.withdrawal),
	};
}
