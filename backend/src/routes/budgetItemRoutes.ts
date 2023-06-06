import { FastifyInstance } from "fastify";
import { BudgetItem } from "../db/entities/budgetItem.js";
import { User } from "../db/entities/User.js";
import { BudgetBody } from "../db/types.js";
import { InvalidDataError } from "../helperMethods/errors.js";
import { validateBudgetBody } from "../helperMethods/validation.js";

async function budgetItemRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("bad instance");
	}

	app.post<{ Body: BudgetBody }>("/budgetItem", async (req, reply) => {
		const toAdd: BudgetBody = req.body;
		try {
			const user = await req.em.getReference(User, toAdd.owner_id);

			const item = await req.em.create(BudgetItem, {
				...validateBudgetBody(toAdd, user),
				owner: user,
			});

			console.log(item);
			await req.em.flush();

			return reply.send(item);
		} catch (err) {
			if (err instanceof InvalidDataError) return reply.status(err.status).send(err);
			return reply.status(500).send(err);
		}
	});

	app.delete<{ Body: { id: number; userId: number } }>("/budgetItem", async (req, reply) => {
		const { userId, id } = req.body;

		try {
			const item = await req.em.getReference(BudgetItem, id);
			console.log(item);
			await req.em.removeAndFlush(item);
			return reply.send(item);
		} catch (err) {
			return reply.status(500).send(err);
		}
	});

	app.search<{ Body: { userId: number } }>("/budgetItem", async (req, reply) => {
		const { userId } = req.body;

		try {
			const item = await req.em.find(BudgetItem, { owner: userId });
			console.log(item);
			return reply.send(item);
		} catch (err) {
			return reply.status(500).send(err);
		}
	});
}

export default budgetItemRoutes;
