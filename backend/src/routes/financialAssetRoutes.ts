import { FinancialAsset } from "../db/entities/financialasset.js";
import { FastifyInstance } from "fastify";
import { RFBaseBody } from "../db/types.js";
import { User } from "../db/entities/User.js";
import { CapAsset } from "../db/entities/capasset.js";
import { validateRFBaseBody } from "../helperMethods/validation.js";
import { InvalidDataError } from "../helperMethods/errors.js";
import { RentalAsset } from "../db/entities/rentalasset.js";
import { BudgetItem } from "../db/entities/budgetItem.js";

async function financialAssetRoutes(app: FastifyInstance, _options = {}) {
	if (!app) throw new Error("error with instance in gin asset");

	app.post<{ Body: RFBaseBody }>("/financialAsset", async (req, reply) => {
		const toBeAdded = req.body;
		try {
			const finAsset = await req.em.create(FinancialAsset, {
				...(await validateRFBaseBody(toBeAdded, app, req)),
			});

			await req.em.flush();
			return reply.send(finAsset);
		} catch (err) {
			console.log(err);
			if (err instanceof InvalidDataError) return reply.status(err.status).send(err);
			return reply.status(500).send(err);
		}
	});
	app.delete<{ Body: { idsToDelete: number; userId: number } }>(
		"/financialAsset",

		async (req, reply) => {
			const { userId, idsToDelete } = req.body;
			try {
				const item = await req.em.findOneOrFail(FinancialAsset, { id: idsToDelete, owner: userId });
				await req.em.remove(item);
				await req.em.flush();
				return reply.send(idsToDelete);
			} catch (err) {
				return reply.status(500).send(err);
			}
		}
	);

	app.search<{ Body: { userId: number } }>("/financialAsset", async (req, reply) => {
		const { userId } = req.body;

		try {
			const item = await req.em.find(FinancialAsset, { owner: userId });
			return reply.send(item);
		} catch (err) {
			return reply.status(500).send(err);
		}
	});

	app.put<{ Body: { userid: number; toUpdate: FinancialAsset } }>(
		"/financialAsset",

		async (req, reply) => {
			const { userid, toUpdate } = req.body;

			try {
				const item = await req.em.findOneOrFail(FinancialAsset, { owner: userid, id: toUpdate.id });
				Object.getOwnPropertyNames(toUpdate).forEach((x) => {
					item[x] = toUpdate[x];
				});
				await req.em.flush();
				return reply.send(item);
			} catch (err) {
				return reply.status(500).send(err);
			}
		}
	);
}

export default financialAssetRoutes;
