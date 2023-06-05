import { FastifyInstance } from "fastify";
import { OneTimeIncomeBody } from "../db/types.js";
import { User } from "../db/entities/User.js";
import { OneTimeIncome } from "../db/entities/OneTimeIncome.js";
import { FinancialAsset } from "../db/entities/financialasset.js";
import { BudgetItem } from "../db/entities/budgetItem.js";

async function OneTimeIncomeRoutes(app: FastifyInstance, _options = {}) {
	if (!app) throw new Error("this is the worst");

	app.post<{ Body: OneTimeIncomeBody }>("/oneTimeIncome", async (req, reply) => {
		const toBeAdded = req.body;
		try {
			const user = await req.em.findOneOrFail(User, { id: toBeAdded.owner_id });

			const { local, federal, state, capitalGains, fica } = await app.getTaxItems(
				req,
				toBeAdded.local,
				toBeAdded.state,
				toBeAdded.federal,
				toBeAdded.capitalGains,
				toBeAdded.fica
			);

			toBeAdded.date = new Date(toBeAdded.date) ?? user.start;
			const oti = await req.em.create(OneTimeIncome, {
				...toBeAdded,
				owner: user,
				local,
				federal,
				state,
				capitalGains,
				fica,
			});

			await req.em.flush();

			return reply.send(oti);
		} catch (err) {
			return reply.status(500).send(err);
		}
	});

	app.delete<{ Body: { id: number; userId: number } }>("/oneTimeIncome", async (req, reply) => {
		const { userId, id } = req.body;

		try {
			const item = await req.em.findOneOrFail(
				OneTimeIncome,
				{ id, owner: userId },
				{ strict: true }
			);
			console.log(item);
			await req.em.removeAndFlush(item);
			return reply.send(item);
		} catch (err) {
			reply.status(500).send(err);
		}
	});

	app.search<{ Body: { userId: number } }>("/OneTimeIncome", async (req, reply) => {
		const { userId } = req.body;

		try {
			const item = await req.em.find(OneTimeIncome, { owner: userId });
			console.log(item);
			return reply.send(item);
		} catch (err) {
			reply.status(500).send(err);
		}
	});
}

export default OneTimeIncomeRoutes;
