import dotenv from "dotenv";
dotenv.config();
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { VerifyPayloadType } from "@fastify/jwt";

declare module "fastify" {
	interface FastifyRequest {
		// You can easily find the type of this return using intellisense inferral below
		jwtVerify(): Promise<VerifyPayloadType>;
	}
	interface FastifyInstance {
		auth(): void;
	}
}

export const AuthPlugin = fp(async function (app: FastifyInstance, opts: FastifyPluginOptions) {
	app.register(import("fastify-auth0-verify"), {
		secret: process.env.AUTH_SECRET,
		domain: process.env.AUTH_DOMAIN,
	});

	app.addHook("onRequest", async function (request: FastifyRequest, reply: FastifyReply) {
		try {
			if (request.url == "/user" && request.method == "POST") return;
			await request.jwtVerify();
		} catch (err) {
			app.log.error(err);
			reply.send(err);
		}
	});
});
