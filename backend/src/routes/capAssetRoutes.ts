import { FastifyInstance } from "fastify";
import { CapAsset } from "../db/entities/capasset.js";
import { InvalidDataError } from "../helperMethods/errors.js";
import { CAssetBody } from "../db/backendTypes/createTypes.js";

async function capAssetRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}

	app.post<{ Body: CAssetBody }>("/capitalAsset", async (req, reply) => {
		const toAdd: CAssetBody = req.body;
		try {
			const toAddInit = await app.validateCapitalAssetInputBody(toAdd, app, req);
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

	app.delete<{ Body: { idsToDelete: number; userId: number } }>(
		"/capitalAsset",

		async (req, reply) => {
			const { userId, idsToDelete } = req.body;
			try {
				const item = await req.em.findOneOrFail(CapAsset, { id: idsToDelete, owner: userId });
				await req.em.removeAndFlush(item);
				return reply.send(`${item.name} successfully deleted`);
			} catch (err) {
				return reply.status(404).send(err);
			}
		}
	);

	app.search<{ Body: { userId: number } }>("/capitalAsset", async (req, reply) => {
		const { userId } = req.body;
		try {
			const item = await req.em.find(CapAsset, { owner: userId });
			return reply.send(item);
		} catch (err) {
			return reply.status(404).send(err);
		}
	});

	app.put<{ Body: { userid: number; toUpdate: CAssetBody } }>(
		"/capitalAsset",
		async (req, reply) => {
			const { userid, toUpdate } = req.body;
			try {
				const toUpdateInit = {
					id: toUpdate.id,
					...(await app.validateCapitalAssetInputBody(toUpdate, app, req)),
				};
				const item = await req.em.findOneOrFail(CapAsset, { owner: userid, id: toUpdate.id });
				Object.getOwnPropertyNames(toUpdateInit).forEach((x) => {
					item[x] = toUpdateInit[x];
				});
				await req.em.flush();
				return reply.send(`${item.name} successfully updated`);
			} catch (err) {
				app.log.error(err);
				return reply.status(404).send(err);
			}
		}
	);
}

export default capAssetRoutes;
