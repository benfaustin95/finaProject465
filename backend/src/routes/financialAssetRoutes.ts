import { FinancialAsset } from "../db/entities/financialasset.js";
import { FastifyInstance } from "fastify";
import { InvalidDataError } from "../helperMethods/errors.js";
import { RFBaseBody } from "../db/backendTypes/createTypes.js";

async function financialAssetRoutes(app: FastifyInstance, _options = {}) {
	if (!app) throw new Error("error with instance in gin asset");

	app.post<{ Body: RFBaseBody }>("/financialAsset", async (req, reply) => {
		const toBeAdded = req.body;
		try {
			const finAsset = await req.em.create(FinancialAsset, {
				...(await app.validateRFBaseBody(toBeAdded, app, req)),
			});
			await req.em.flush();
			return reply.send(`${finAsset.name} successfully created`);
		} catch (err) {
			app.log.error(err);
			if (err instanceof InvalidDataError) return reply.status(err.status).send(err);
			return reply.status(500).send(err);
		}
	});
	app.delete<{ Body: { idsToDelete: number; userId: number } }>(
		"/financialAsset",
		async (req, reply) => {
			const { userId, idsToDelete } = req.body;
			try {
				const item = await req.em.findOneOrFail(
					FinancialAsset,
					{ id: idsToDelete, owner: userId },
					{
						populate: ["Dividends"],
					}
				);
				await req.em.remove(item);
				for (const x of item.Dividends.getItems()) {
					await req.em.remove(x);
				}
				await req.em.flush();
				return reply.send(`${item.name} successfully created`);
			} catch (err) {
				return reply.status(404).send(err);
			}
		}
	);

	app.search<{ Body: { userId: number } }>("/financialAsset", async (req, reply) => {
		const { userId } = req.body;
		try {
			const item = await req.em.find(FinancialAsset, { owner: userId });
			return reply.send(item);
		} catch (err) {
			return reply.status(404).send(err);
		}
	});

	app.put<{ Body: { userid: number; toUpdate: RFBaseBody } }>(
		"/financialAsset",
		async (req, reply) => {
			const { userid, toUpdate } = req.body;
			try {
				const toUpdateInit = {
					id: toUpdate.id,
					...(await app.validateRFBaseBody(toUpdate, app, req)),
				};
				const item = await req.em.findOneOrFail(FinancialAsset, { owner: userid, id: toUpdate.id });
				Object.getOwnPropertyNames(toUpdateInit).forEach((x) => {
					item[x] = toUpdateInit[x];
				});
				await req.em.flush();
				return reply.send(`${item.name} successfully updated`);
			} catch (err) {
				return reply.status(500).send(err);
			}
		}
	);
}

export default financialAssetRoutes;
