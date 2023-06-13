import {
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
import { FastifyInstance, FastifyRequest } from "fastify";
import {
	getRecurrence,
	getType,
	validateBaseInputBody,
	validateBoundedDate,
	validateDate,
	validateDollarAmount,
	validateName,
	validateRate,
	validateWithdrawalPriority,
} from "../helperMethods/validation.js";
import { FinancialAsset } from "../db/entities/financialasset.js";
import { InvalidDataError } from "../helperMethods/errors.js";
import { User } from "../db/entities/User.js";
import { Recurrence } from "../db/entities/budgetItem.js";
import { PrivateMethod } from "@swc/core";
import fp from "fastify-plugin";

declare module "fastify" {
	interface FastifyInstance {
		validateRentalAsset(
			item: RentalAssetBody,
			app: FastifyInstance,
			req: FastifyRequest
		): Promise<RentalAssetBodyInit>;
		validateRFBaseBody(
			item: RFBaseBody,
			app: FastifyInstance,
			req: FastifyRequest
		): Promise<RFBaseBodyInit>;
		validateOneTimeIncomeBody(
			item: OneTimeIncomeBody,
			app: FastifyInstance,
			req: FastifyRequest
		): Promise<OneTimeIncomeBodyInit>;
		validateDividendInputBody(
			item: DividendBody,
			app: FastifyInstance,
			req: FastifyRequest
		): Promise<DividendBodyInit>;
		validateCapitalAssetInputBody(
			item: CAssetBody,
			app: FastifyInstance,
			req: FastifyRequest
		): Promise<CAssetBodyInit>;
		validateBudgetBody(item: BudgetBody, user: User): Promise<BudgetBodyInit>;
	}
}

const fastifyValidatePlugin = async (app: FastifyInstance, options) => {
	async function validateRentalAsset(
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

	app.decorate("validateRentalAsset", validateRentalAsset);
	async function validateRFBaseBody(
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

	app.decorate("validateRFBaseBody", validateRFBaseBody);
	async function validateOneTimeIncomeBody(
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

	app.decorate("validateOneTimeIncomeBody", validateOneTimeIncomeBody);
	async function validateDividendInputBody(
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

	app.decorate("validateDividendInputBody", validateDividendInputBody);
	async function validateCapitalAssetInputBody(
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

	app.decorate("validateCapitalAssetInputBody", validateCapitalAssetInputBody);
	function validateBudgetBody(item: BudgetBody, user: User): BudgetBodyInit {
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

	app.decorate("validateBudgetBody", validateBudgetBody);
};

export const FastifyValidationPlugin = fp(fastifyValidatePlugin, {
	name: "validate",
});
