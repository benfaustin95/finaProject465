import { FastifyInstance } from "fastify";
import { User } from "../db/entities/User.js";
import { OneTimeIncome } from "../db/entities/OneTimeIncome.js";
import { FinancialAsset } from "../db/entities/financialasset.js";
import { BudgetItem } from "../db/entities/budgetItem.js";
import { validateOneTimeIncomeBody } from "../helperMethods/validation.js";
import { InvalidDataError } from "../helperMethods/errors.js";
import { RentalAsset } from "../db/entities/rentalasset.js";
import { OneTimeIncomeBody } from "../db/backendTypes/createTypes.js";

async function OneTimeIncomeRoutes(app: FastifyInstance, _options = {}) {
	if (!app) throw new Error("this is the worst");

	app.post<{ Body: OneTimeIncomeBody }>("/oneTimeIncome", async (req, reply) => {
		const toBeAdded = req.body;
		try {
			const toBeAddedInit = await validateOneTimeIncomeBody(toBeAdded, app, req);
			const oti = await req.em.create(OneTimeIncome, {
				...toBeAddedInit,
			});

			await req.em.flush();
			return reply.send(`${oti.name} successfully created`);
		} catch (err) {
			if (err instanceof InvalidDataError) return reply.status(err.status).send(err);
			return reply.status(500).send(err);
		}
	});

	app.delete<{ Body: { idsToDelete: number; userId: number } }>(
		"/oneTimeIncome",
		async (req, reply) => {
			const { userId, idsToDelete } = req.body;
			try {
				const item = await req.em.findOneOrFail(OneTimeIncome, { id: idsToDelete, owner: userId });
				await req.em.removeAndFlush(item);
				return reply.send(`${item.name} successfully deleted`);
			} catch (err) {
				return reply.status(404).send(err);
			}
		}
	);

	app.search<{ Body: { userId: number } }>("/oneTimeIncome", async (req, reply) => {
		const { userId } = req.body;
		try {
			const item = await req.em.find(OneTimeIncome, { owner: userId });
			return reply.send(item);
		} catch (err) {
			return reply.status(404).send(err);
		}
	});

	app.put<{ Body: { userid: number; toUpdate: OneTimeIncomeBody } }>(
		"/oneTimeIncome",
		async (req, reply) => {
			const { userid, toUpdate } = req.body;
			const toUpdateInit = {
				id: toUpdate.id,
				...(await validateOneTimeIncomeBody(toUpdate, app, req)),
			};
			try {
				const item = await req.em.findOneOrFail(OneTimeIncome, { owner: userid, id: toUpdate.id });
				Object.getOwnPropertyNames(toUpdateInit).forEach((x) => {
					item[x] = toUpdateInit[x];
				});
				await req.em.flush();
				return reply.send(`${item.name} successfully updated`);
			} catch (err) {
				return reply.status(500).send(err);
			}
		}
	);
}

export default OneTimeIncomeRoutes;
