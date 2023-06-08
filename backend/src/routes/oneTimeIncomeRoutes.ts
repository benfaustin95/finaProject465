import { FastifyInstance } from "fastify";
import { OneTimeIncomeBody } from "../db/types.js";
import { User } from "../db/entities/User.js";
import { OneTimeIncome } from "../db/entities/OneTimeIncome.js";
import { FinancialAsset } from "../db/entities/financialasset.js";
import { BudgetItem } from "../db/entities/budgetItem.js";
import { validateOneTimeIncomeBody } from "../helperMethods/validation.js";
import { InvalidDataError } from "../helperMethods/errors.js";
import { RentalAsset } from "../db/entities/rentalasset.js";

async function OneTimeIncomeRoutes(app: FastifyInstance, _options = {}) {
	if (!app) throw new Error("this is the worst");

	app.post<{ Body: OneTimeIncomeBody }>("/oneTimeIncome", async (req, reply) => {
		const toBeAdded = req.body;
		try {
			const toBeAddedInit = await validateOneTimeIncomeBody(toBeAdded, app, req);
			toBeAdded.date = new Date(toBeAdded.date) ?? toBeAddedInit.owner.start;

			const oti = await req.em.create(OneTimeIncome, {
				...toBeAddedInit,
			});

			await req.em.flush();
			return reply.send(oti);
		} catch (err) {
			if (err instanceof InvalidDataError) return reply.status(err.status).send(err);
			return reply.status(500).send(err);
		}
	});

	app.delete<{ Body: { idsToDelete: number[]; userId: number } }>(
		"/oneTimeIncome",
		async (req, reply) => {
			const { userId, idsToDelete } = req.body;
			console.log(req.body, idsToDelete instanceof Array);
			try {
				for (const id of idsToDelete) {
					const item = await req.em.findOne(OneTimeIncome, { id, owner: userId });
					console.log(item);
					await req.em.remove(item);
				}
				await req.em.flush();
				return reply.send(idsToDelete);
			} catch (err) {
				return reply.status(500).send(err);
			}
		}
	);
	app.search<{ Body: { userId: number } }>("/oneTimeIncome", async (req, reply) => {
		const { userId } = req.body;

		try {
			const item = await req.em.find(OneTimeIncome, { owner: userId });
			console.log(item);
			return reply.send(item);
		} catch (err) {
			return reply.status(500).send(err);
		}
	});
}

export default OneTimeIncomeRoutes;
