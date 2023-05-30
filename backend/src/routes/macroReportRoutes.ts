import { FastifyInstance } from "fastify";
import { User } from "../db/entities/User.js";
import exp from "constants";
import { BudgetItem } from "../db/entities/budgetItem.js";

function validateTimePeriod(start: Date, end: Date) {
	if(end == undefined)
		return {valid: false, message: `the request is missing a terminating date`};
	if(end < start)
		return {valid: false, message: `the request period ending:${end} occurs before retirement start date`};
	return {valid: true, message: ``};
}

async function macroReportRoutes(app: FastifyInstance, options = {}) {
	if (!app) throw new Error("app error macro report routes");

	app.search<{ Body: { email: string; end: Date } }>(
		"/macroReport",
		async (req, reply) => {
			// eslint-disable-next-line
			let { email, end } = req.body;
			const toSendBudget = {};
			try {
				const user = await req.em.findOneOrFail(
					User,
					{ email },
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
				if(end == undefined) return reply.status(500).send("abd date")
				end = new Date(end);
				const validDate = validateTimePeriod(user.start, end);

				if(!validDate.valid)
					return reply.status(500).send(new Error(`Error: ${validDate.message}`));

				const rentalAssets = user.rentalAssets.getItems();
				const finAssets = user.financialAssets.getItems();
				const dividends = user.dividends.getItems();
				const budgetItems = user.budgetItems.getItems();
				const capAssets = user.capitalAssets.getItems()
				const oneTimeIncome = user.oneTimeIncomes.getItems()

				//quick calculation to have expenses/income from start to start of request period:
				//what is output to the user.
				console.log(user.start);
				for (let year = user.start.getFullYear(); year <= end.getFullYear(); ++year) {
					toSendBudget[year] = app.macroYearOutput(
						budgetItems.filter((x) => x.start.getFullYear() <= year && x.end.getFullYear() >= year),
						capAssets.filter((x) => x.start.getFullYear() <= year && x.end.getFullYear() >= year),
						dividends,
						finAssets,
						oneTimeIncome.filter((x) => x.date.getFullYear() === year),
						rentalAssets,
						year
					);
					console.log(toSendBudget[year]);
				}
				reply.send(toSendBudget);
			} catch (err) {
				console.log(err);
				reply.status(500).send(err);
			}
		}
	);
}

export default macroReportRoutes;
