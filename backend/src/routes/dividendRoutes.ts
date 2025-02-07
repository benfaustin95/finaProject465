import { FastifyInstance } from "fastify";
import { Dividend } from "../db/entities/Dividend.js";
import { InvalidDataError } from "../helperMethods/errors.js";
import { DividendBody } from "../db/backendTypes/createTypes.js";

async function dividendRoutes(app: FastifyInstance, _options = {}) {
	if (!app) throw new Error("something");

	app.post<{ Body: DividendBody }>("/dividend", async (req, reply) => {
		const toBeAdded = req.body;
		try {
			const toAddInit = await app.validateDividendInputBody(toBeAdded, app, req);
			const dividend = await req.em.create(Dividend, {
				...toAddInit,
			});
			await req.em.flush();
			return reply.send(dividend);
		} catch (err) {
			if (err instanceof InvalidDataError) return reply.status(err.status).send(err);
			return reply.status(500).send(err);
		}
	});

	app.delete<{ Body: { idsToDelete: number; userId: number } }>("/dividend", async (req, reply) => {
		const { userId, idsToDelete } = req.body;
		try {
			const item = await req.em.findOneOrFail(Dividend, { id: idsToDelete, owner: userId });
			await req.em.removeAndFlush(item);
			return reply.send(`${item.name} successfully deleted`);
		} catch (err) {
			return reply.status(500).send(err);
		}
	});

	app.search<{ Body: { userId: number } }>("/dividend", async (req, reply) => {
		const { userId } = req.body;
		try {
			const item = await req.em.find(Dividend, { owner: userId });
			return reply.send(item);
		} catch (err) {
			return reply.status(404).send(err);
		}
	});

	app.put<{ Body: { userid: number; toUpdate: DividendBody } }>("/dividend", async (req, reply) => {
		const { userid, toUpdate } = req.body;
		try {
			const toUpdateInit = {
				id: toUpdate.id,
				...(await app.validateDividendInputBody(toUpdate, app, req)),
			};
			const item = await req.em.findOneOrFail(Dividend, { owner: userid, id: toUpdate.id });
			Object.getOwnPropertyNames(toUpdateInit).forEach((x) => {
				item[x] = toUpdateInit[x];
			});
			await req.em.flush();
			return reply.send(`${item.name} successfully updated`);
		} catch (err) {
			return reply.status(500).send(err);
		}
	});
}

export default dividendRoutes;
