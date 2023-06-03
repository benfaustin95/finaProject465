import { Level } from "./entities/Tax.js";
import { CapAssetType } from "./entities/capasset.js";
import { taxAccumulate } from "../plugins/helperFunctions/incomeMonthOutput.js";

export type ICreateUsersBody = {
	name: string;
	email: string;
	age: number;
	birthday: Date;
};

export type BudgetBody = {
	note: string;
	name: string;
	amount: number;
	growthRate: number;
	recurrence: string;
	start: Date;
	end: Date;
	email: string;
};
interface BaseInputBody {
	email: string;
	name: string;
	note: string;
	growthRate: number;
	state: string;
	federal: string;
	local: string;
}

export interface CAssetBody extends BaseInputBody {
	start: Date;
	end: Date;
	income: number;
	recurrence: string;
	type: CapAssetType;
}

export interface RFBaseBody extends BaseInputBody {
	totalValue: number;
	costBasis: number;
	wPriority: number;
}

export interface RenAssetBody extends RFBaseBody {
	owed: number;
	maintenanceExpense: number;
	grossIncome: number;
}

export interface OneTimeIncomeBody extends BaseInputBody {
	date: Date;
	cashBasis: number;
	email: string;
}

export interface DividendBody extends BaseInputBody {
	rate: number;
	finAsset: string;
}

export class taxOutput {
	federal: number = 0;
	state: number = 0;
	local: number = 0;
	capitalGains: number = 0;
	fica: number = 0;
}

export class taxAccumulator extends taxOutput {
	federalIncome: number = 0;
	stateIncome: number = 0;
	localIncome: number = 0;
	capitalGainsIncome: number = 0;
	ficaIncome: number = 0;
}

export interface destructuredTaxAccumulator {
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

export interface destructuredMonthlyTaxAccumulator {
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
export interface incomeCalculation {
	income: number;
	tax: taxOutput;
}

export interface incomeYear {
	outHuman: outputRow;
	outSocial: outputRow;
	outNonTaxable: outputRow;
	outRental: outputRow;
	outOneTime: outputRow;
	taxes: Map<number, taxAccumulator>;
}

export interface destructuredIncomeYear {
	outHuman: destructuredOutputRow;
	outSocial: destructuredOutputRow;
	outNonTaxable: destructuredOutputRow;
	outRental: destructuredOutputRow;
	outOneTime: destructuredOutputRow;
	taxes: destructuredTaxAccumulator;
}
export class amount {
	year: number;
	value: number = 0;
}
export interface outputRow {
	name: string;
	note: string;
	amounts: Map<number, number>;
}

export interface monthOutputRow {
	name: string;
	note: string;
	amounts: Map<string, number>;
}
export interface destructuredOutputRow {
	name: string;
	note: string;
	amounts: [number, number][];
}

export interface destructuredMonthOutputRow {
	name: string;
	note: string;
	amounts: [[number, number], number][];
}
export interface destructuredWithOutputRow extends destructuredOutputRow {
	updatedValue: [number, number][];
}
export interface withdrawalOutputRow extends outputRow {
	updatedValue: Map<number, number>;
}
export interface withdrawalMonthOutputRow extends monthOutputRow {
	updatedValue: Map<string, number>;
}

export interface destructuredWithdrawalMonthOutputRow extends destructuredMonthOutputRow {
	updatedValue: [[number, number], number][];
}
export interface expenseYear {
	outputRecurring: Map<number, outputRow>;
	outputNonRecurring: Map<number, outputRow>;
	monthlyExpense: outputRow;
	annualExpense: outputRow;
}

export interface expenseMonth {
	outReccuring: monthOutputRow;
	outNonReccuring: monthOutputRow;
}

export interface destructuredExpenseYear {
	outputRecurring: Array<[number, destructuredOutputRow]>;
	outputNonRecurring: Array<[number, destructuredOutputRow]>;
	monthlyExpense: destructuredOutputRow;
	annualExpense: destructuredOutputRow;
}
export interface withdrawal {
	outputWithdrawal: Map<number, withdrawalOutputRow>;
	outDividend: Map<number, outputRow>;
}

export interface withdrawalMonth {
	outputWithdrawal: Map<number, withdrawalMonthOutputRow>;
	outDividend: Map<number, monthOutputRow>;
}
export interface destructuredWithdrawal {
	outputWithdrawal: [number, destructuredWithOutputRow][];
	outDividend: [number, destructuredOutputRow][];
}
export interface row {
	name: string;
	note: string;
	amount: number;
}

export interface macroYearReport {
	expenses: expenseYear;
	incomes: incomeYear;
	withdrawals: withdrawal;
	deficit: outputRow;
}

export interface destructuredMacroYearReport {
	expenses: destructuredExpenseYear;
	incomes: destructuredIncomeYear;
	withdrawals: destructuredWithdrawal;
	deficit: destructuredOutputRow;
}
export interface microYearReport {
	expensesByMonth: number[];
	incomesByMonth: incomeMonth[];
	withdrawalsByMonth: withdrawal[];
	year: number;
}

export interface incomeMonth {
	salary: Map<number, monthOutputRow>;
	investments: Map<number, monthOutputRow>;
	retirementIncome: Map<number, monthOutputRow>;
	nonTaxable: Map<number, monthOutputRow>;
	oneTimeIncome: Map<number, monthOutputRow>;
	taxes: Map<string, taxAccumulator>;
	monthlyIncome: monthOutputRow;
}

export interface dateKey {
	month: number;
	year: number;
}

export interface microMonthReport {
	expense: expenseMonth;
	income: incomeMonth;
	deficit: monthOutputRow;
	withdrawal: withdrawalMonth;
}
