import fastify, { FastifyInstance, FastifyRequest } from "fastify";
import { CAssetBody } from "../db/types.js";
import { Level, TaxRate } from "../db/entities/Tax.js";
import fp from "fastify-plugin";

declare module "fastify" {
	interface FastifyInstance {
		getTaxItems: (
			req: FastifyRequest,
			localName: string,
			stateName: string,
			federalName: string
		) => { local: TaxRate; state: TaxRate; federal: TaxRate };
	}
}
const fastifyTax = async (app: FastifyInstance, options) => {
	const getTaxItems = async (
		req: FastifyRequest,
		localName: string,
		stateName: string,
		federalName: string
	) => {
		const local = await req.em.findOne(TaxRate, {
			location: localName,
			level: Level.LOCAL,
		});
		const state = await req.em.findOne(TaxRate, {
			location: stateName,
			level: Level.STATE,
		});
		const federal = await req.em.findOne(TaxRate, {
			location: federalName,
			level: Level.FEDERAL,
		});

		return { local, state, federal };
	};
	app.decorate("getTaxItems", getTaxItems);
};

export const FastifyTaxPlugin = fp(fastifyTax, {
	name: "getTaxItems",
});
