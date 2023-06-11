import { InvalidDataError } from "./errors.js";
import { User } from "../db/entities/User.js";
import { Recurrence } from "../db/entities/budgetItem.js";
import { FastifyInstance, FastifyRequest } from "fastify";
import { CapAssetType } from "../db/entities/capasset.js";
import { FinancialAsset } from "../db/entities/financialasset.js";
import {
	BaseInputBody,
	BaseInputBodyInit,
	BudgetBody,
	BudgetBodyInit,
	CAssetBody,
	CAssetBodyInit,
	DividendBody,
	DividendBodyInit,
	OneTimeIncomeBody,
	OneTimeIncomeBodyInit,
	RentalAssetBody,
	RentalAssetBodyInit,
	RFBaseBody,
	RFBaseBodyInit,
} from "../db/backendTypes/createTypes.js";

function validateName(name: string, type: string) {
	if (name == undefined || name == "")
		throw new InvalidDataError({
			status: 422,
			message: `invalid ${type} name ${name}`,
			cause: "name",
		});
	return name;
}

function validateDollarAmount(amount: number, type: string) {
	if (amount == undefined || isNaN(amount) || amount <= 0)
		throw new InvalidDataError({
			status: 422,
			message: `invalid ${type} value ${amount}`,
			cause: type,
		});
	return amount;
}

function validateGrowthRate(growthRate: number, type: string) {
	if (growthRate == undefined || isNaN(growthRate) || growthRate < 0)
		throw new InvalidDataError({
			status: 422,
			message: `invalid ${type} growth rate ${growthRate}`,
			cause: "growthRate",
		});
	return 1 + growthRate / 100;
}

function validateDate(start: string | Date, type: string | Date) {
	const toReturn = new Date(start);
	if (isNaN(toReturn.getTime()))
		throw new InvalidDataError({
			status: 422,
			message: `invalid ${type} date ${start}`,
			cause: type + "Date",
		});
	return toReturn;
}

function validateBoundedDate(start: string, end: string, user) {
	const validStart = start == undefined ? user.start : start;
	const validEnd = end == undefined ? new Date("1/2/3000") : end;

	return { start: validateDate(validStart, "start"), end: validateDate(validEnd, "end") };
}

export function getRecurrence(recurrence: string) {
	switch (recurrence) {
		case Recurrence.NON:
			return Recurrence.NON;
		case Recurrence.ANNUALLY:
			return Recurrence.ANNUALLY;
		case Recurrence.MONTHLY:
			return Recurrence.MONTHLY;
		case Recurrence.WEEKLY:
			return Recurrence.DAILY;
		default:
			throw new InvalidDataError({
				status: 422,
				message: `invalid recurrence: ${recurrence}`,
				cause: "recurrence",
			});
	}
}

export function validateBudgetBody(item: BudgetBody, user: User): BudgetBodyInit {
	const toReturn: BudgetBodyInit = {
		name: validateName(item.name, "budget"),
		note: item.note != undefined ? item.note : "",
		amount: validateDollarAmount(item.amount, "expense"),
		growthRate: 1,
		recurrence: getRecurrence(item.recurrence),
		owner_id: item.owner_id,
		...validateBoundedDate(item.start, item.end, user),
	};

	if (toReturn.recurrence == Recurrence.NON) toReturn.end = new Date(toReturn.start);

	return toReturn;
}

export async function validateBaseInputBody(
	item: BaseInputBody,
	req: FastifyRequest,
	app: FastifyInstance
): Promise<BaseInputBodyInit> {
	try {
		const owner = await req.em.getReference(User, item.owner_id);
		const tax = await app.getTaxItems(
			req,
			item.local,
			item.state,
			item.federal,
			item.capitalGains,
			item.fica
		);
		const toReturn = {
			name: validateName(item.name, "Capital Asset"),
			note: item.note ?? "",
			growthRate: validateGrowthRate(item.growthRate, "Capital Asset"),
			...tax,
			owner,
		};
		return toReturn;
	} catch (err) {
		if (!(err instanceof InvalidDataError))
			throw new InvalidDataError({ status: 422, message: err.message, cause: err });
		throw err;
	}
}

export function getType(type: string) {
	switch (type) {
		case CapAssetType.NONTAXABLEANNUITY:
			return CapAssetType.NONTAXABLEANNUITY;
		case CapAssetType.HUMAN:
			return CapAssetType.HUMAN;
		case CapAssetType.SOCIAL:
			return CapAssetType.SOCIAL;
		default:
			throw new InvalidDataError({
				status: 422,
				message: `invalid Capital Asset Type: ${type}`,
				cause: "capitalAssetType",
			});
	}
}

export async function validateCapitalAssetInputBody(
	item: CAssetBody,
	app: FastifyInstance,
	req: FastifyRequest
): Promise<CAssetBodyInit> {
	const toReturn = await validateBaseInputBody(item, req, app);
	return {
		...toReturn,
		...validateBoundedDate(item.start, item.end, toReturn.owner),
		income: validateDollarAmount(item.income, "income"),
		recurrence: getRecurrence(item.recurrence),
		type: getType(item.type),
	};
}

function validateRate(rate: number) {
	if (rate == undefined || isNaN(rate) || rate <= 0)
		throw new InvalidDataError({
			status: 422,
			message: `invalid dividend rate ${rate}`,
			cause: "rate",
		});
	return rate / 100;
}

export async function validateDividendInputBody(
	item: DividendBody,
	app: FastifyInstance,
	req: FastifyRequest
): Promise<DividendBodyInit> {
	try {
		const base = await validateBaseInputBody(item, req, app);
		return {
			...base,
			rate: validateRate(item.rate),
			asset: await req.em.getReference(FinancialAsset, item.asset),
		};
	} catch (err) {
		if (!(err instanceof InvalidDataError))
			throw new InvalidDataError({ status: 422, message: err.message, cause: err });
		throw err;
	}
}

export async function validateOneTimeIncomeBody(
	item: OneTimeIncomeBody,
	app: FastifyInstance,
	req: FastifyRequest
): Promise<OneTimeIncomeBodyInit> {
	return {
		...(await validateBaseInputBody(item, req, app)),
		date: validateDate(item.date, "Date of one time income"),
		cashBasis: validateDollarAmount(item.cashBasis, "one time income cash basis"),
	};
}

function validateWithdrawalPriority(wPriority: number) {
	if (wPriority == undefined || !Number.isInteger(wPriority))
		throw new InvalidDataError({
			status: 422,
			message: `invalid withdrawal priority ${wPriority}`,
			cause: `withdrawalPriority`,
		});
	return wPriority;
}

export async function validateRFBaseBody(
	item: RFBaseBody,
	app: FastifyInstance,
	req: FastifyRequest
): Promise<RFBaseBodyInit> {
	return {
		...(await validateBaseInputBody(item, req, app)),
		totalValue: validateDollarAmount(item.totalValue, "Asset Total Value"),
		costBasis: validateDollarAmount(item.costBasis, "Asset Cost Basis"),
		wPriority: validateWithdrawalPriority(item.wPriority),
	};
}

export async function validateRentalAsset(
	item: RentalAssetBody,
	app: FastifyInstance,
	req: FastifyRequest
): Promise<RentalAssetBodyInit> {
	return {
		...(await validateRFBaseBody(item, app, req)),
		owed: validateDollarAmount(item.owed, `amount owed on ${item.name}`),
		maintenanceExpense: validateDollarAmount(
			item.maintenanceExpense,
			`monthly expense for ${item.name}`
		),
		grossIncome: validateDollarAmount(item.grossIncome, `monthly gross income ${item.name}`),
	};
}
