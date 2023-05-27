import { FastifyInstance } from "fastify";
import { User } from "../db/entities/User.js";
import { DividendBody } from "../db/types.js";
import { Dividend } from "../db/entities/Dividend.js";
import * as repl from "repl";
import { FinancialAsset } from "../db/entities/financialasset.js";

async function dividendRoutes(app: FastifyInstance, _options = {}) {
	if (!app) throw new Error("something");

	app.post<{ Body: DividendBody }>("/dividend", async (req, reply) => {
		const toBeAdded = req.body;

		try {
			const user = await req.em.findOneOrFail(User, { email: toBeAdded.email });
			const finAsset = await req.em.findOneOrFail(FinancialAsset, { name: toBeAdded.finAsset });

			const { local, federal, state } = await app.getTaxItems(
				req,
				toBeAdded.local,
				toBeAdded.state,
				toBeAdded.federal
			);

			const dividend = await req.em.create(Dividend, {
				...toBeAdded,
				owner: user,
				local,
				federal,
				state,
				asset: finAsset,
			});

			await req.em.flush();

			return reply.send(dividend);
		} catch (err) {
			return reply.status(500).send(err);
		}
	});
}

export default dividendRoutes;
