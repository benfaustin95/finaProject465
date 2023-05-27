import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { User } from "../db/entities/User.js";
import { ICreateUsersBody } from "../db/types.js";

async function userRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}

	app.post<{ Body: ICreateUsersBody }>("/user", async (req, reply) => {
		const user = req.body;
	console.log(user);
		try {
			const existing = await req.em.findOne(User, { email: user.email });
			console.log(existing);
			if (existing != null) return reply.status(401).send(`Unable to create user ${user.email}`);

			const userCreated = await req.em.create(User, { ...user });

			await req.em.flush();
			return reply.send(userCreated);
		} catch (err) {
			return reply.status(500).send(err);
		}
	});

}
export default userRoutes;
