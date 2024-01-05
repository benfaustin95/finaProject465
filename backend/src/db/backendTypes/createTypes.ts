import { User, MaritalStatus } from "../entities/User.js";
import { Level, TaxRate } from "../entities/Tax.js";
import { FinancialAsset } from "../entities/financialasset.js";
import { Recurrence } from "../entities/budgetItem.js";
import { CapAssetType } from "../entities/capasset.js";

//Types used in item creation

export type UsersBody = {
	name: string;
	email: string;
	start: string;
	birthday: string;
	marital_status: MaritalStatus,
	id: number;
};
export type BudgetBody = {
	note: string;
	name: string;
	amount: number;
	growthRate: number;
	recurrence: string;
	start: string;
	end: string;
	owner_id: number;
	id: number;
};
export type BudgetBodyInit = {
	note: string;
	name: string;
	amount: number;
	growthRate: number;
	recurrence: Recurrence;
	start: Date;
	end: Date;
	owner_id: number;
};

export interface BaseInputBody {
	owner_id: number;
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

export interface BaseInputBodyInit {
	owner: User;
	name: string;
	note: string;
	growthRate: number;
	state: TaxRate;
	federal: TaxRate;
	local: TaxRate;
	fica: TaxRate;
	capitalGains: TaxRate;
}

export interface CAssetBody extends BaseInputBody {
	start: string;
	end: string;
	income: number;
	recurrence: string;
	type: string;
}

export interface RFBaseBody extends BaseInputBody {
	totalValue: number;
	costBasis: number;
	wPriority: number;
}

export interface RFBaseBodyInit extends BaseInputBodyInit {
	totalValue: number;
	costBasis: number;
	wPriority: number;
}

export interface RentalAssetBody extends RFBaseBody {
	owed: number;
	maintenanceExpense: number;
	grossIncome: number;
}

export interface RentalAssetBodyInit extends RFBaseBodyInit {
	owed: number;
	maintenanceExpense: number;
	grossIncome: number;
}

export interface TaxBody extends RFBaseBody {
	level: Level;
	location: string;
	rate: number;
}

export interface OneTimeIncomeBody extends BaseInputBody {
	date: string;
	cashBasis: number;
}

export interface OneTimeIncomeBodyInit extends BaseInputBodyInit {
	date: Date;
	cashBasis: number;
}

export interface DividendBody extends BaseInputBody {
	rate: number;
	asset: number;
}

export interface DividendBodyInit extends BaseInputBodyInit {
	rate: number;
	asset: FinancialAsset;
}

export interface CAssetBodyInit extends BaseInputBodyInit {
	start: Date;
	end: Date;
	income: number;
	recurrence: Recurrence;
	type: CapAssetType;
}
