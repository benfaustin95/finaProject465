import { Level } from "./entities/Tax.js";
import {CapAssetType} from "./entities/capasset.js";

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
	type: CapAssetType
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

export interface taxItem {
	level: Level;
	rate: number;
	location: string;
}

export interface taxOutput {
	federal:number;
	state:number;
	local:number;
	capitalGains:number;
}
