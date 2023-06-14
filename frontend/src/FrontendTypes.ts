import { PostInputService } from "@/Services/PostInputService.tsx";
export type UsersBody = {
	name: string;
	email: string;
	age: number;
	birthday: Date;
};
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

export enum RouteTypes {
	BUDGET = "budgetItem",
	CAPASSET = "capitalAsset",
	DIVIDEND = "dividend",
	ONETIMEINCOME = "oneTimeIncome",
	FINASSET = "financialAsset",
	RENATLASSET = "rentalAsset",
	CAPGAINS = "capitalGains",
	FICA = "fica",
	FEDERAL = "federal",
	STATE = "state",
	LOCAL = "local",
}

export type TaxObject = {
	level: string;
	location: string;
	rate: number;
};
export interface BaseInput {
	owner_id: number;
	name: string;
	note: string;
	growthRate: number;
	state: TaxObject;
	federal: TaxObject;
	local: TaxObject;
	fica: TaxObject;
	capitalGains: TaxObject;
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

export function getTax(item: BaseInput) {
	return {
		capitalGains: item.capitalGains != null ? item.capitalGains.location : "",
		fica: item.fica != null ? item.fica.location : "",
		federal: item.federal != null ? item.federal.location : "",
		state: item.state != null ? item.state.location : "",
		local: !item.local ? "" : item.local.location,
	};
}
export function createSubmitNewItemForm(type: string) {
	return (event, actions) => {
		console.log(event);
		actions.setStatus("Submitting...");
		PostInputService.send(`/${type}`, event)
			.then((res) => {
				console.log(res);
				if (res.status != 200) console.log("bad");
				actions.resetForm();
				actions.setSubmitting(false);
				actions.setStatus(undefined);
			})
			.catch((err) => {
				console.log(err);
				actions.setStatus({ error: true, message: "Submit Failed Please Try Again" });
				actions.setSubmitting(false);
			});
	};
}

export function getGrowthRatePercent(rate: number) {
	if (rate == 0) return rate;
	return Math.round((rate - 1) * 100);
}
