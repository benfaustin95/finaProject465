export enum CapAssetType {
	HUMAN = "human capital",
	NONTAXABLEANNUITY = "non-taxable annuity",
	SOCIAL = "social capital",
}

export enum Recurrence {
	DAILY = "daily",
	WEEKLY = "weekly",
	MONTHLY = "monthly",
	ANNUALLY = "annually",
	NON = "non-reoccurring",
}

export interface BaseInput {
	owner: number;
	name: string;
	note: string;
	growthRate: number;
	state: string;
	federal: string;
	local: string;
	fica: string;
	capitalGains: string;
	id: number;
}
export interface BudgetItem extends BaseInput {
	recurrence: string;
	amount: number;
	start: string;
	end: string;
}
export interface CapAsset extends BaseInput {
	start: Date;
	end: Date;
	income: number;
	recurrence: string;
	type: string;
}

export interface RFBase extends BaseInput {
	totalValue: number;
	costBasis: number;
	wPriority: number;
}

export interface RentalAsset extends RFBase {
	owed: number;
	maintenanceExpense: number;
	grossIncome: number;
}

export interface OneTimeIncome extends BaseInput {
	date: Date;
	cashBasis: number;
}

export interface Dividend extends BaseInput {
	rate: number;
	asset: number;
}

export type entityType = BudgetItem | CapAsset | OneTimeIncome | Dividend | RentalAsset | RFBase;

export function isBudgetItem(item: entityType): item is BudgetItem {
	return (item as BudgetItem).amount != undefined;
}
