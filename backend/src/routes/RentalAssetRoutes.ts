import { FastifyInstance } from "fastify";
import { RentalAsset } from "../db/entities/rentalasset.js";
import { InvalidDataError } from "../helperMethods/errors.js";
import { RentalAssetBody, RFBaseBody } from "../db/backendTypes/createTypes.js";

async function RentalAssetRoutes(app: FastifyInstance, _options = {}) {
	if (!app) throw new Error("error with instance in gin asset");

	app.post<{ Body: RentalAssetBody }>("/rentalAsset", async (req, reply) => {
		const toBeAdded = req.body;
		try {
			const rentalAsset = await req.em.create(RentalAsset, {
				...(await app.validateRentalAsset(toBeAdded, app, req)),
			});
			await req.em.flush();
			return reply.send(`${rentalAsset.name} successfully created`);
		} catch (err) {
			console.log(err);
			if (err instanceof InvalidDataError) return reply.status(err.status).send(err);
			return reply.status(500).send(err);
		}
	});

	app.delete<{ Body: { idsToDelete: number; userId: number } }>(
		"/rentalAsset",
		async (req, reply) => {
			const { userId, idsToDelete } = req.body;
			try {
				const item = await req.em.findOneOrFail(RentalAsset, { id: idsToDelete, owner: userId });
				await req.em.removeAndFlush(item);
				return reply.send(`${item.name} successfully deleted`);
			} catch (err) {
				return reply.status(404).send(err);
			}
		}
	);

	app.search<{ Body: { userId: number } }>("/rentalAsset", async (req, reply) => {
		const { userId } = req.body;
		try {
			const item = await req.em.find(RentalAsset, { owner: userId });
			return reply.send(item);
		} catch (err) {
			return reply.status(500).send(err);
		}
	});
	app.put<{ Body: { userid: number; toUpdate: RentalAssetBody } }>(
		"/rentalAsset",
		async (req, reply) => {
			const { userid, toUpdate } = req.body;
			try {
				const toUpdateInit = {
					id: toUpdate.id,
					...(await app.validateRentalAsset(toUpdate, app, req)),
				};
				const item = await req.em.findOneOrFail(RentalAsset, { owner: userid, id: toUpdate.id });
				Object.getOwnPropertyNames(toUpdateInit).forEach((x) => {
					item[x] = toUpdateInit[x];
				});
				await req.em.flush();
				return reply.send(`${item.name} successfully updated`);
			} catch (err) {
				return reply.status(404).send(err);
			}
		}
	);
}
export default RentalAssetRoutes;
