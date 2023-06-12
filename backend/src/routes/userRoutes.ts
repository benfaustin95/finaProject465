import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { User } from "../db/entities/User.js";

import { UsersBody } from "../db/backendTypes/createTypes.js";
import { SOFT_DELETABLE, SOFT_DELETABLE_FILTER } from "mikro-orm-soft-delete";
import { getEntryPoints } from "typedoc/dist/lib/utils/index.js";

async function userRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}

	app.post<{ Body: UsersBody }>("/user", async (req, reply) => {
		const user = req.body;
		let userCreated;
		console.log(user);
		try {
			const existing = await req.em.findOne(
				User,
				{ email: user.email },
				{ filters: { [SOFT_DELETABLE_FILTER]: false } }
			);
			console.log(existing);
			if (existing == null) userCreated = await req.em.create(User, { ...user });
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
			console.log(err);
			return reply.status(422).send(err);
		}
	});

	app.search<{ Body: { email: string } }>("/user", async (req, reply) => {
		const { email } = req.body;
		console.log(email);
		try {
			const existing = await req.em.findOneOrFail(User, { email });
			return reply.send(existing.id);
		} catch (err) {
			return reply.status(404).send(`User does not exist, ${email}`);
		}
	});

	app.delete<{ Body: { id: number } }>("/user", async (req, reply) => {
		const { id } = req.body;
		try {
			const user = await req.em.getReference(User, id);
			await req.em.removeAndFlush(user);
			return reply.send(`delete successfull`);
		} catch (err) {
			return reply.status(404).send(`User note found`);
		}
	});
}
export default userRoutes;
