import { FastifyInstance } from "fastify";
import { User } from "../db/entities/User.js";

async function microReportRoutes(app: FastifyInstance, options = {}) {
	if (!app) throw new Error("microreport bad");

	app.search<{ Body: { id: number } }>("/microReport", async (req, reply) => {
		const { id } = req.body;
		try {
			const user = await req.em.findOneOrFail(User, id, {
				populate: [
					"budgetItems",
					"financialAssets",
					"capitalAssets",
					"rentalAssets",
					"dividends",
					"oneTimeIncomes",
				],
			});
			const rentalAssets = user.rentalAssets.getItems();
			const finAssets = user.financialAssets.getItems();
			const dividends = user.dividends.getItems();
			const budgetItems = user.budgetItems.getItems();
			const capAssets = user.capitalAssets.getItems();
			const oneTimeIncome = user.oneTimeIncomes.getItems();
			const end = new Date(user.start.getFullYear() + 4, 11, 31);
			const toSend = app.microYearReport(
				budgetItems,
				capAssets,
				oneTimeIncome,
				dividends,
				finAssets,
				rentalAssets,
				user.start,
				end
			);
			reply.send(toSend);
		} catch (err) {
			app.log.error(err);
			reply.status(404).send(err);
		}
	});
}

export default microReportRoutes;
