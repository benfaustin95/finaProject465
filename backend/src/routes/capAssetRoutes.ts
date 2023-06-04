import { FastifyInstance } from "fastify";
import { User } from "../db/entities/User.js";
import { CAssetBody } from "../db/types.js";
import { CapAsset, CapAssetType } from "../db/entities/capasset.js";
import { getRecurrence } from "./budgetItemRoutes.js";
import { Recurrence } from "../db/entities/budgetItem.js";

export function getType(type: string) {
	switch (type) {
		case CapAssetType.NONTAXABLEANNUITY:
			return CapAssetType.NONTAXABLEANNUITY;
		case CapAssetType.HUMAN:
			return CapAssetType.HUMAN;
		case CapAssetType.SOCIAL:
			return CapAssetType.SOCIAL;
		default:
			return CapAssetType.SOCIAL;
	}
}
async function capAssetRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}

	app.post<{ Body: CAssetBody }>("/capitalAsset", async (req, reply) => {
		const toAdd = req.body;

		try {
			const user = await req.em.findOneOrFail(User, { id: toAdd.owner_id });
			const recurrence = getRecurrence(toAdd.recurrence);
			const type = getType(toAdd.type);

			const { local, state, federal, capitalGains, fica } = await app.getTaxItems(
				req,
				toAdd.local,
				toAdd.state,
				toAdd.federal,
				toAdd.capitalGains,
				toAdd.fica
			);

			toAdd.start = toAdd.start == undefined ? new Date() : toAdd.start;

			if (recurrence == Recurrence.NON) {
				toAdd.end = new Date(toAdd.start);
			}

			toAdd.end = toAdd.end == undefined ? new Date("1/1/3000") : toAdd.end;

			const asset = req.em.create(CapAsset, {
				...toAdd,
				owner: user,
				state,
				federal,
				local,
				capitalGains,
				fica,
				recurrence,
				type,
			});

			await req.em.flush();

			return reply.send(asset);
		} catch (err) {
			return reply.status(500).send(err);
		}
	});

	app.delete<{ Body: { id: number; userId: number } }>("/capitalAsset", async (req, reply) => {
		const { userId, id } = req.body;

		try {
			const item = await req.em.findOneOrFail(CapAsset, { id, owner: userId }, { strict: true });
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
