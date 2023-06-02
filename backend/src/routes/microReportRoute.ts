import { FastifyInstance } from "fastify";
import { User } from "../db/entities/User.js";
import { microYearReport } from "../db/types.js";

async function microReportRoutes(app: FastifyInstance, options = {}) {
	if (!app) throw new Error("microreport bad");

	app.search<{ Body: { id: number } }>("/microReport", async (req, reply) => {
		const { id } = req.body;
		const toSend: microYearReport[] = [];
		try {
			const user = await req.em.findOneOrFail(
				User,
				id,
				{
					populate: [
						"budgetItems",
						"financialAssets",
						"capitalAssets",
						"rentalAssets",
						"dividends",
						"oneTimeIncomes",
					],
				}
			);

			const rentalAssets = user.rentalAssets.getItems();
			const finAssets = user.financialAssets.getItems();
			const dividends = user.dividends.getItems();
			const budgetItems = user.budgetItems.getItems();
			const capAssets = user.capitalAssets.getItems();
			const oneTimeIncome = user.oneTimeIncomes.getItems();

			// for(let year = user.start.getFullYear(); year<=user.start.getFullYear()+5;++year){
			const year = user.start.getFullYear();
			for (let i = year; i < year + 5; ++i) {
				toSend.push(
					app.microYearReport(
						budgetItems.filter((x) => x.start.getFullYear() <= year && x.end.getFullYear() >= year),
						capAssets.filter((x) => x.start.getFullYear() <= year && x.end.getFullYear() >= year),
						oneTimeIncome.filter((x) => x.date.getFullYear() === year),
						dividends,
						finAssets,
						rentalAssets,
						year
					)
				);
			}
			reply.send(toSend);
		} catch (err) {
			reply.status(500).send(err);
		}
	});
}

export default microReportRoutes;
