import { FastifyInstance } from "fastify";
import { User } from "../db/entities/User.js";

import { UsersBody } from "../db/backendTypes/createTypes.js";
import { SOFT_DELETABLE_FILTER } from "mikro-orm-soft-delete";
import { use } from "chai";

async function userRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}

	app.post<{ Body: UsersBody }>("/user", async (req, reply) => {
		const user = req.body;
		let userCreated;
		try {
			const existing = await req.em.findOne(
				User,
				{ email: user.email },
				{ filters: { [SOFT_DELETABLE_FILTER]: false } }
			);
			if (existing == null)
				userCreated = await req.em.create(User, {
					name: user.name,
					start: user.start,
					birthday: user.birthday,
					email: user.email,
				});
			else if (existing != null && existing.deleted_at == null)
				return reply.status(401).send(`Unable to create user ${user.email}`);
			else {
				Object.getOwnPropertyNames(user).forEach((x) => {
					existing[x] = user[x];
				});
			}
			await req.em.flush();
			return reply.send({ id: existing != null ? existing.id : userCreated.id });
		} catch (err) {
			app.log.error(err);
			return reply.status(422).send(err);
		}
	});

	app.search<{ Body: { email: string } }>("/user", async (req, reply) => {
		const { email } = req.body;
		try {
			const existing = await req.em.findOneOrFail(
				User,
				{ email },
				{ filters: { [SOFT_DELETABLE_FILTER]: false } }
			);
			if (existing.deleted_at != null) {
				existing.deleted_at = null;
				await req.em.flush();
			}
			return reply.send(existing);
		} catch (err) {
			return reply.status(404).send(`User does not exist, ${email}`);
		}
	});

	app.delete<{ Body: { idsToDelete: number } }>("/user", async (req, reply) => {
		const { idsToDelete } = req.body;
		try {
			const user = await req.em.getReference(User, idsToDelete);
			await req.em.removeAndFlush(user);
			return reply.send(`delete successfull`);
		} catch (err) {
			return reply.status(404).send(`User not found`);
		}
	});

	app.put<{ Body: { userid: number; toUpdate: UsersBody } }>("/user", async (req, reply) => {
		const { userid, toUpdate } = req.body;
		try {
			const user = await req.em.findOneOrFail(User, { id: toUpdate.id });
			Object.getOwnPropertyNames(toUpdate).forEach((x) => {
				user[x] = toUpdate[x];
			});
			await req.em.flush();
			return reply.send(`${user.name} successfully updated`);
		} catch (err) {
			return reply.status(404).send(err);
		}
	});
}
export default userRoutes;
