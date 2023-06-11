import { FastifyInstance } from "fastify";
import { User } from "../db/entities/User.js";
import { sendMacroReport } from "../helperMethods/destructure.js";

function validateTimePeriod(start: Date, end: number) {
	if (end == undefined)
		return { valid: false, message: `the request is missing a terminating date` };
	if (end < start.getUTCFullYear())
		return {
			valid: false,
			message: `the request period ending:${end} occurs before retirement start date`,
		};
	return { valid: true, message: `` };
}

async function macroReportRoutes(app: FastifyInstance, options = {}) {
	if (!app) throw new Error("app error macro report routes");

	app.search<{ Body: { id: number; end: number } }>("/macroReport", async (req, reply) => {
		// eslint-disable-next-line
		let { id, end } = req.body;
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
			if (end == undefined) return reply.status(500).send("add date");
			const validDate = validateTimePeriod(user.start, end);

			if (!validDate.valid) return reply.status(500).send(new Error(`Error: ${validDate.message}`));

			const rentalAssets = user.rentalAssets.getItems();
			const finAssets = user.financialAssets.getItems();
			const dividends = user.dividends.getItems();
			const budgetItems = user.budgetItems.getItems();
			const capAssets = user.capitalAssets.getItems();
			const oneTimeIncome = user.oneTimeIncomes.getItems();

			//quick calculation to have expenses/income from start to start of request period:
			//what is output to the user.
			const toSendBudget = app.macroYearOutput(
				budgetItems,
				capAssets,
				dividends,
				finAssets,
				oneTimeIncome,
				rentalAssets,
				user.start.getUTCFullYear(),
				end,
				user.start.getMonth()
			);
			return reply.send(sendMacroReport(toSendBudget));
		} catch (err) {
			console.log(err);
			return reply.status(500).send(err);
		}
	});
}

export default macroReportRoutes;
