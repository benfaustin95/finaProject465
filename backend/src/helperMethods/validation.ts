import {
	BaseInputBody,
	BaseInputBodyInit,
	BudgetBody,
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
} from "../db/types.js";
import { InvalidDataError } from "./errors.js";
import { User } from "../db/entities/User.js";
import { Recurrence } from "../db/entities/budgetItem.js";
import { FastifyInstance, FastifyRequest } from "fastify";
import { CapAssetType } from "../db/entities/capasset.js";
import { FinancialAsset } from "../db/entities/financialasset.js";

function validateName(name: string, type: string) {
	if (name == undefined || name == "")
		throw new InvalidDataError({
			status: 422,
			message: `invalid ${type} name ${name}`,
			cause: "name",
		});
	return name;
}

function validateExpense(amount: number, type: string) {
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
	return growthRate;
}

function validateDate(start: Date, type: string) {
	const toReturn = new Date(start);
	if (isNaN(toReturn.getTime()))
		throw new InvalidDataError({
			status: 422,
			message: `invalid ${type} date ${start}`,
			cause: type + "Date",
		});
	return toReturn;
}

function validateBoundedDate(start: Date, end: Date, user) {
	const validStart = start == undefined ? user.start : start;
	const validEnd = end == undefined ? new Date("1/1/3000") : end;

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

export function validateBudgetBody(item: BudgetBody, user: User): BudgetBody {
	const toReturn: BudgetBody = {
		name: validateName(item.name, "budget"),
		note: item.note != undefined ? item.note : "",
		amount: validateExpense(item.amount, "expense"),
		growthRate: 1,
		recurrence: getRecurrence(item.recurrence),
		owner_id: item.owner_id,
		...validateBoundedDate(item.start, item.end, user),
	};

	if (toReturn.recurrence == Recurrence.NON) toReturn.end = new Date(toReturn.start);

	return toReturn;
}

export function validateBaseInputBody(
	item: BaseInputBody,
	req: FastifyRequest,
	app: FastifyInstance
): BaseInputBodyInit {
	try {
		return {
			name: validateName(item.name, "Capital Asset"),
			note: item.note ?? "",
			growthRate: validateGrowthRate(item.growthRate, "Capital Asset"),
			...app.getTaxItems(req, item.local, item.state, item.federal, item.capitalGains, item.fica),
			owner: req.em.getReference(User, item.owner_id),
		};
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

export function validateCapitalAssetInputBody(
	item: CAssetBody,
	app: FastifyInstance,
	req: FastifyRequest
): CAssetBodyInit {
	const toReturn = validateBaseInputBody(item, req, app);
	return {
		...toReturn,
		start: validateDate(item.start, "start"),
		end: validateDate(item.end, "end"),
		income: validateExpense(item.income, "income"),
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
	return rate;
}

export function validateDividendInputBody(
	item: DividendBody,
	app: FastifyInstance,
	req: FastifyRequest
): DividendBodyInit {
	try {
		return {
			...validateBaseInputBody(item, req, app),
			rate: validateRate(item.rate),
			finAsset: req.em.getReference(FinancialAsset, item.finAsset),
		};
	} catch (err) {
		if (!(err instanceof InvalidDataError))
			throw new InvalidDataError({ status: 422, message: err.message, cause: err });
		throw err;
	}
}

export function validateOneTimeIncomeBody(
	item: OneTimeIncomeBody,
	app: FastifyInstance,
	req: FastifyRequest
): OneTimeIncomeBodyInit {
	return {
		...validateBaseInputBody(item, req, app),
		date: validateDate(item.date, "Date of one time income"),
		cashBasis: validateExpense(item.cashBasis, "one time income cash basis"),
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

export function validateRFBaseBody(
	item: RFBaseBody,
	app: FastifyInstance,
	req: FastifyRequest
): RFBaseBodyInit {
	return {
		...validateBaseInputBody(item, req, app),
		totalValue: validateExpense(item.totalValue, "Asset Total Value"),
		costBasis: validateExpense(item.costBasis, "Asset Cost Basis"),
		wPriority: validateWithdrawalPriority(item.wPriority),
	};
}

export function validateRentalAsset(
	item: RentalAssetBody,
	app: FastifyInstance,
	req: FastifyRequest
): RentalAssetBodyInit {
	return {
		...validateRFBaseBody(item, app, req),
		owed: validateExpense(item.owed, `amount owed on ${item.name}`),
		expense: validateExpense(item.expense, `monthly expense for ${item.name}`),
		grossIncome: validateExpense(item.grossIncome, `monthly gross income ${item.name}`),
	};
}
