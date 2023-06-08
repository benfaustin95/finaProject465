import { FinancialAsset } from "../db/entities/financialasset.js";
import { FastifyInstance } from "fastify";
import { RentalAssetBody, RFBaseBody } from "../db/types.js";
import { User } from "../db/entities/User.js";
import { RentalAsset } from "../db/entities/rentalasset.js";
import { BudgetItem } from "../db/entities/budgetItem.js";
import { validateRentalAsset } from "../helperMethods/validation.js";
import { InvalidDataError } from "../helperMethods/errors.js";

async function RentalAssetRoutes(app: FastifyInstance, _options = {}) {
	if (!app) throw new Error("error with instance in gin asset");

	app.post<{ Body: RentalAssetBody }>("/rentalAsset", async (req, reply) => {
		const toBeAdded = req.body;
		try {
			const rentalAsset = await req.em.create(RentalAsset, {
				...(await validateRentalAsset(toBeAdded, app, req)),
			});

			await req.em.flush();
			return reply.send(rentalAsset);
		} catch (err) {
			console.log(err);
			if (err instanceof InvalidDataError) return reply.status(err.status).send(err);
			return reply.status(500).send(err);
		}
	});

	app.delete<{ Body: { idsToDelete: number[]; userId: number } }>(
		"/rentalAsset",
		async (req, reply) => {
			const { userId, idsToDelete } = req.body;
			console.log(req.body, idsToDelete instanceof Array);
			try {
				for (const id of idsToDelete) {
					const item = await req.em.findOne(RentalAsset, { id, owner: userId });
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

	app.search<{ Body: { userId: number } }>("/rentalAsset", async (req, reply) => {
		const { userId } = req.body;

		try {
			const item = await req.em.find(RentalAsset, { owner: userId });
			console.log(item);
			return reply.send(item);
		} catch (err) {
			return reply.status(500).send(err);
		}
	});
}

export default RentalAssetRoutes;
