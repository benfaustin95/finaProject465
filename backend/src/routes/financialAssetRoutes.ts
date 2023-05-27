import { FinancialAsset } from "../db/entities/financialasset.js";
import { FastifyInstance } from "fastify";
import { RFBaseBody} from "../db/types.js";
import { User } from "../db/entities/User.js";

async function financialAssetRoutes(app: FastifyInstance, _options = {}) {
	if (!app) throw new Error("error with instance in gin asset");

	app.post<{ Body: RFBaseBody }>("/financialAsset", async (req, reply) => {
		const toBeAdded = req.body;
		try {
			const user = await req.em.findOneOrFail(User, { email: toBeAdded.email});
			const { local, federal, state } = await app.getTaxItems(
				req,
				toBeAdded.local,
				toBeAdded.state,
				toBeAdded.federal
			);

			const finAsset = await req.em.create(FinancialAsset, {
				...toBeAdded,
				federal,
				state,
				local,
				owner: user,
			});

			await req.em.flush();

			return reply.send(finAsset);
		} catch (err) {
			console.log(err);
			return reply.status(500).send(err);
		}
	});
}


export default financialAssetRoutes;
