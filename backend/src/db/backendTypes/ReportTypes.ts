//Types used to structure report output

export class TaxOutput {
	federal: number = 0;
	state: number = 0;
	local: number = 0;
	capitalGains: number = 0;
	fica: number = 0;
}

export class TaxAccumulator extends TaxOutput {
	federalIncome: number = 0;
	stateIncome: number = 0;
	localIncome: number = 0;
	capitalGainsIncome: number = 0;
	ficaIncome: number = 0;
}

export interface IncomeCalculation {
	income: number;
	tax: TaxOutput;
}

export interface MacroIncome {
	outHuman: MacroOutputRow;
	outSocial: MacroOutputRow;
	outNonTaxable: MacroOutputRow;
	outRental: MacroOutputRow;
	outOneTime: MacroOutputRow;
	taxes: Map<number, TaxAccumulator>;
}

export class Amount {
	year: number;
	value: number = 0;
}
export interface MacroOutputRow {
	name: string;
	note: string;
	amounts: Map<number, number>;
}

export interface MicroOutputRow {
	name: string;
	note: string;
	amounts: Map<string, number>;
}

export interface MacroWithdrawalOutputRow extends MacroOutputRow {
	updatedValue: Map<number, number>;
}
export interface MicroWithdrawalOutputRow extends MicroOutputRow {
	updatedValue: Map<string, number>;
}

export interface MacroExpense {
	outputRecurring: Map<number, MacroOutputRow>;
	outputNonRecurring: Map<number, MacroOutputRow>;
	monthlyExpense: MacroOutputRow;
	annualExpense: MacroOutputRow;
}

export interface MicroExpense {
	outReoccurring: MicroOutputRow;
	outNonReoccurring: MicroOutputRow;
}

export interface MacroWithdrawal {
	outputWithdrawal: Map<number, MacroWithdrawalOutputRow>;
	outDividend: Map<number, MacroOutputRow>;
	remainder: MacroOutputRow;
}

export interface MicroWithdrawal {
	outputWithdrawal: Map<number, MicroWithdrawalOutputRow>;
	outDividend: Map<number, MicroOutputRow>;
	remainder: MicroOutputRow;
}

export interface MacroReport {
	expenses: MacroExpense;
	incomes: MacroIncome;
	withdrawals: MacroWithdrawal;
	deficit: MacroOutputRow;
}

export interface MicroIncome {
	salary: Map<number, MicroOutputRow>;
	investments: Map<number, MicroOutputRow>;
	retirementIncome: Map<number, MicroOutputRow>;
	nonTaxable: Map<number, MicroOutputRow>;
	oneTimeIncome: Map<number, MicroOutputRow>;
	taxes: Map<string, TaxAccumulator>;
	monthlyIncome: MicroOutputRow;
}

export interface DateKey {
	month: number;
	year: number;
}

export interface MicroReport {
	expense: MicroExpense;
	income: MicroIncome;
	deficit: MicroOutputRow;
	withdrawal: MicroWithdrawal;
}
