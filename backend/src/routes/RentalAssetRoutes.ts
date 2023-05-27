import { FinancialAsset } from "../db/entities/financialasset.js";
import { FastifyInstance } from "fastify";
import { RFBaseBody } from "../db/types.js";
import { User } from "../db/entities/User.js";
import { RentalAsset } from "../db/entities/rentalasset.js";

async function RentalAssetRoutes(app: FastifyInstance, _options = {}) {
	if (!app) throw new Error("error with instance in gin asset");

	app.post<{ Body: RFBaseBody }>("/rentalAsset", async (req, reply) => {
		const toBeAdded = req.body;
		try {
			const user = await req.em.findOneOrFail(User, { email: toBeAdded.email });
			const { local, federal, state } = await app.getTaxItems(
				req,
				toBeAdded.local,
				toBeAdded.state,
				toBeAdded.federal
			);

			const rentalAsset = await req.em.create(RentalAsset, {
				...toBeAdded,
				federal,
				state,
				local,
				owner: user,
			});

			await req.em.flush();

			return reply.send(rentalAsset);
		} catch (err) {
			console.log(err);
			return reply.status(500).send(err);
		}
	});
}

export default RentalAssetRoutes;
