import { FastifyInstance } from "fastify";
import { User } from "../db/entities/User.js";
import { DividendBody } from "../db/types.js";
import { Dividend } from "../db/entities/Dividend.js";
import * as repl from "repl";
import { FinancialAsset } from "../db/entities/financialasset.js";
import { BudgetItem } from "../db/entities/budgetItem.js";
import { validateDividendInputBody } from "../helperMethods/validation.js";
import { InvalidDataError } from "../helperMethods/errors.js";

async function dividendRoutes(app: FastifyInstance, _options = {}) {
	if (!app) throw new Error("something");

	app.post<{ Body: DividendBody }>("/dividend", async (req, reply) => {
		const toBeAdded = req.body;

		try {
			const dividend = await req.em.create(Dividend, {
				...validateDividendInputBody(toBeAdded, app, req),
			});

			await req.em.flush();
			return reply.send(dividend);
		} catch (err) {
			if (err instanceof InvalidDataError) return reply.status(err.status).send(err);
			return reply.status(500).send(err);
		}
	});

	app.delete<{ Body: { id: number; userId: number } }>("/dividend", async (req, reply) => {
		const { userId, id } = req.body;

		try {
			const item = await req.em.getReference(Dividend, id);
			console.log(item);
			await req.em.removeAndFlush(item);
			return reply.send(item);
		} catch (err) {
			reply.status(500).send(err);
		}
	});

	app.search<{ Body: { userId: number } }>("/dividend", async (req, reply) => {
		const { userId } = req.body;

		try {
			const item = await req.em.find(Dividend, { owner: userId });
			console.log(item);
			return reply.send(item);
		} catch (err) {
			reply.status(500).send(err);
		}
	});
}

export default dividendRoutes;
