//types use to destructure reports for sending via HTTP requests

export interface DestructuredTaxAccumulator {
	capitalGains: [number, number][];
	fica: [number, number][];
	federal: [number, number][];
	state: [number, number][];
	local: [number, number][];
	capitalGainsIncome: [number, number][];
	ficaIncome: [number, number][];
	federalIncome: [number, number][];
	stateIncome: [number, number][];
	localIncome: [number, number][];
}

export interface DestructuredMicroTaxAccumulator {
	capitalGains: [[number, number], number][];
	fica: [[number, number], number][];
	federal: [[number, number], number][];
	state: [[number, number], number][];
	local: [[number, number], number][];
	capitalGainsIncome: [[number, number], number][];
	ficaIncome: [[number, number], number][];
	federalIncome: [[number, number], number][];
	stateIncome: [[number, number], number][];
	localIncome: [[number, number], number][];
}

export interface DestructuredMacroIncome {
	outHuman: DestructuredMacroOutputRow;
	outSocial: DestructuredMacroOutputRow;
	outNonTaxable: DestructuredMacroOutputRow;
	outRental: DestructuredMacroOutputRow;
	outOneTime: DestructuredMacroOutputRow;
	taxes: DestructuredTaxAccumulator;
}

export interface DestructuredMacroOutputRow {
	name: string;
	note: string;
	amounts: [number, number][];
}

export interface DestructuredMicroOutputRow {
	name: string;
	note: string;
	amounts: [[number, number], number][];
}

export interface DestructuredWithMacroOutputRow extends DestructuredMacroOutputRow {
	updatedValue: [number, number][];
}

export interface DestructuredMicroWithdrawalOutputRow extends DestructuredMicroOutputRow {
	updatedValue: [[number, number], number][];
}

export interface DestructuredMacroExpense {
	outputRecurring: Array<[number, DestructuredMacroOutputRow]>;
	outputNonRecurring: Array<[number, DestructuredMacroOutputRow]>;
	monthlyExpense: DestructuredMacroOutputRow;
	annualExpense: DestructuredMacroOutputRow;
}

export interface DestructuredMicroExpense {
	outRecurring: DestructuredMicroOutputRow;
	outNonRecurring: DestructuredMicroOutputRow;
}

export interface DestructuredMacroWithdrawal {
	outputWithdrawal: [number, DestructuredWithMacroOutputRow][];
	outDividend: [number, DestructuredMacroOutputRow][];
	remainder: DestructuredMacroOutputRow;
}

export interface DestructuredMicroWithdrawal {
	outputWithdrawal: [number, DestructuredMicroWithdrawalOutputRow][];
	outDividend: [number, DestructuredMicroOutputRow][];
	remainder: DestructuredMicroOutputRow;
}

export interface DestructuredMacroReport {
	expenses: DestructuredMacroExpense;
	incomes: DestructuredMacroIncome;
	withdrawals: DestructuredMacroWithdrawal;
	deficit: DestructuredMacroOutputRow;
}

export interface DestructuredMicroIncome {
	salary: [number, DestructuredMicroOutputRow][];
	investments: [number, DestructuredMicroOutputRow][];
	retirementIncome: [number, DestructuredMicroOutputRow][];
	nonTaxable: [number, DestructuredMicroOutputRow][];
	oneTimeIncome: [number, DestructuredMicroOutputRow][];
	taxes: DestructuredMicroTaxAccumulator;
	monthlyIncome: DestructuredMicroOutputRow;
}

export interface DestructuredMicroReport {
	expense: DestructuredMicroExpense;
	income: DestructuredMicroIncome;
	deficit: DestructuredMicroOutputRow;
	withdrawal: DestructuredMicroWithdrawal;
}
