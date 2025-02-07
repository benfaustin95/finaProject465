import { FastifyInstance } from "fastify";
import { BudgetItem } from "../db/entities/budgetItem.js";
import { User } from "../db/entities/User.js";
import { InvalidDataError } from "../helperMethods/errors.js";
import { RentalAsset } from "../db/entities/rentalasset.js";
import { BudgetBody, BudgetBodyInit } from "../db/backendTypes/createTypes.js";

async function budgetItemRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("bad instance");
	}

	app.post<{ Body: BudgetBody }>("/budgetItem", async (req, reply) => {
		const toAdd: BudgetBody = req.body;
		try {
			const user = await req.em.getReference(User, toAdd.owner_id);
			const item = await req.em.create(BudgetItem, {
				...(await app.validateBudgetBody(toAdd, user)),
				owner: user,
			});
			await req.em.flush();
			return reply.send("Expense Successfully Created");
		} catch (err) {
			console.log(err);
			if (err instanceof InvalidDataError) return reply.status(err.status).send(err);
			return reply.status(500).send(err);
		}
	});

	app.delete<{ Body: { idsToDelete: number; userId: number } }>(
		"/budgetItem",
		async (req, reply) => {
			const { userId, idsToDelete } = req.body;
			try {
				//need findoneorfail to check userId
				const item = await req.em.findOneOrFail(BudgetItem, { id: idsToDelete, owner: userId });
				await req.em.removeAndFlush(item);
				return reply.send(`${item.name} successfully deleted`);
			} catch (err) {
				return reply.status(404).send(err);
			}
		}
	);

	app.search<{ Body: { userId: number } }>("/budgetItem", async (req, reply) => {
		const { userId } = req.body;
		try {
			const item = await req.em.find(BudgetItem, { owner: userId });
			return reply.send(item);
		} catch (err) {
			return reply.status(404).send(err);
		}
	});

	app.put<{ Body: { userid: number; toUpdate: BudgetBody } }>("/budgetItem", async (req, reply) => {
		const { userid, toUpdate } = req.body;
		try {
			const user = await req.em.getReference(User, userid);
			const toUpdateInit = {
				id: toUpdate.id,
				...(await app.validateBudgetBody(toUpdate, user)),
			};
			const item = await req.em.findOneOrFail(BudgetItem, { owner: userid, id: toUpdate.id });
			Object.getOwnPropertyNames(toUpdateInit).forEach((x) => {
				item[x] = toUpdateInit[x];
			});
			await req.em.flush();
			return reply.send(`${item.name} successfully updated`);
		} catch (err) {
			return reply.status(404).send(err);
		}
	});
}
export default budgetItemRoutes;
