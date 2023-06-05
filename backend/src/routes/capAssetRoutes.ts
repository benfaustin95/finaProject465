import { FastifyInstance } from "fastify";
import { User } from "../db/entities/User.js";
import { CAssetBody, CAssetBodyInit } from "../db/types.js";
import { CapAsset } from "../db/entities/capasset.js";
import { Recurrence } from "../db/entities/budgetItem.js";
import { validateCapitalAssetInputBody } from "../helperMethods/validation.js";
import { InvalidDataError } from "../helperMethods/errors.js";

async function capAssetRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}

	app.post<{ Body: CAssetBody }>("/capitalAsset", async (req, reply) => {
		const toAdd: CAssetBody = req.body;

		try {
			const asset = req.em.create(CapAsset, {
				...validateCapitalAssetInputBody(toAdd, app, req),
			});

			await req.em.flush();

			return reply.send(asset);
		} catch (err) {
			if (err instanceof InvalidDataError) return reply.status(err.status).send(err);
			return reply.status(500).send(err);
		}
	});

	app.delete<{ Body: { id: number; userId: number } }>("/capitalAsset", async (req, reply) => {
		const { userId, id } = req.body;

		try {
			const item = await req.em.getReference(CapAsset, id);
			console.log(item);
			await req.em.removeAndFlush(item);
			return reply.send(item);
		} catch (err) {
			reply.status(500).send(err);
		}
	});

	app.search<{ Body: { userId: number } }>("/capitalAsset", async (req, reply) => {
		const { userId } = req.body;

		try {
			const item = await req.em.find(CapAsset, { owner: userId });
			console.log(item);
			return reply.send(item);
		} catch (err) {
			reply.status(500).send(err);
		}
	});
}

export default capAssetRoutes;
