import {FastifyInstance} from "fastify";
import {BudgetItem, Recurrence} from "../db/entities/budgetItem.js";
import {User} from "../db/entities/User.js";
import {BudgetBody} from "../db/types.js";

export function getRecurrence(recurrence: string) {
	switch (recurrence) {
		case Recurrence.NON:
			return Recurrence.NON;
		case Recurrence.ANNUALLY:
			return Recurrence.ANNUALLY;
		case Recurrence.MONTHLY:
			return Recurrence.MONTHLY;
		case Recurrence.WEEKLY:
			return Recurrence.DAILY;
		default:
			return Recurrence.NON;
	}
}

async function budgetItemRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("bad instance");
	}

	app.post<{ Body: BudgetBody }>("/budgetItem", async (req, reply) => {
		const toAdd = req.body;
		try {
			const user = await req.em.findOneOrFail(User, { email: toAdd.email });

			const recurrence = getRecurrence(toAdd.recurrence);

			toAdd.start = (toAdd.start == undefined? new Date(): toAdd.start);

			if(recurrence == Recurrence.NON) {
				toAdd.end = new Date(toAdd.start);
			}

			toAdd.end = (toAdd.end == undefined? new Date("1/1/3000"): toAdd.end);

			const item = await req.em.create(BudgetItem, {
				...toAdd, recurrence, owner: user
			});
			console.log(item);
			await req.em.flush();

			return reply.send(item);
		} catch (err) {
			return reply.status(500).send(err);
		}
	});
}

export default budgetItemRoutes;
