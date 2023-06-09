import { FastifyInstance } from "fastify";
import { User } from "../db/entities/User.js";
import { CAssetBody, CAssetBodyInit } from "../db/types.js";
import { CapAsset } from "../db/entities/capasset.js";
import { Recurrence } from "../db/entities/budgetItem.js";
import { validateCapitalAssetInputBody } from "../helperMethods/validation.js";
import { InvalidDataError } from "../helperMethods/errors.js";
import { toolbar } from "typedoc/dist/lib/output/themes/default/partials/toolbar.js";
import { RentalAsset } from "../db/entities/rentalasset.js";

async function capAssetRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}

	app.post<{ Body: CAssetBody }>("/capitalAsset", async (req, reply) => {
		const toAdd: CAssetBody = req.body;

		try {
			const toAddInit = await validateCapitalAssetInputBody(toAdd, app, req);
			const asset = req.em.create(CapAsset, {
				...toAddInit,
			});

			await req.em.flush();
			return reply.send(asset);
		} catch (err) {
			if (err instanceof InvalidDataError) return reply.status(err.status).send(err);
			return reply.status(500).send(err);
		}
	});

	app.delete<{ Body: { idsToDelete: number[]; userId: number } }>(
		"/capitalAsset",
		async (req, reply) => {
			const { userId, idsToDelete } = req.body;
			console.log(req.body, idsToDelete instanceof Array);
			try {
				for (const id of idsToDelete) {
					const item = await req.em.findOne(CapAsset, { id, owner: userId });
					await req.em.remove(item);
				}
				await req.em.flush();
				return reply.send(idsToDelete);
			} catch (err) {
				return reply.status(500).send(err);
			}
		}
	);

	app.search<{ Body: { userId: number } }>("/capitalAsset", async (req, reply) => {
		const { userId } = req.body;

		try {
			const item = await req.em.find(CapAsset, { owner: userId });
			return reply.send(item);
		} catch (err) {
			return reply.status(500).send(err);
		}
	});
}

export default capAssetRoutes;
