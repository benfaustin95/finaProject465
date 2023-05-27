import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { User } from "../db/entities/User.js";
import { CAssetBody, ICreateUsersBody } from "../db/types.js";
import { CapAsset } from "../db/entities/capasset.js";
import { Level, TaxItem } from "../db/entities/Tax.js";
import { getRecurrence } from "./budgetItemRoutes.js";
import {Recurrence} from "../db/entities/budgetItem.js";

async function capAssetRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}

	app.post<{ Body: CAssetBody }>("/capitalAsset", async (req, reply) => {
		const toAdd = req.body;

		try {
			const user = await req.em.findOneOrFail(User, { email: toAdd.email });
			const recurrence = getRecurrence(toAdd.recurrence);

			const { local, state, federal } = await app.getTaxItems(
				req,
				toAdd.local,
				toAdd.state,
				toAdd.federal
			);


			toAdd.start = (toAdd.start == undefined? new Date(): toAdd.start);

			if(recurrence == Recurrence.NON) {
				toAdd.end = new Date(toAdd.start);
			}

			toAdd.end = (toAdd.end == undefined? new Date("1/1/3000"): toAdd.end);

			const asset = req.em.create(CapAsset, {
				...toAdd,
				owner: user,
				state,
				federal,
				local,
				recurrence
			});

			await req.em.flush();

			return reply.send(asset);
		} catch (err) {
			return reply.status(500).send(err);
		}
	});
}

export default capAssetRoutes;