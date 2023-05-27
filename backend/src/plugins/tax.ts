import fastify, { FastifyInstance, FastifyRequest } from "fastify";
import { CAssetBody } from "../db/types.js";
import { Level, TaxItem } from "../db/entities/Tax.js";
import fp from "fastify-plugin";

declare module "fastify" {
	interface FastifyInstance {
		getTaxItems: (
			req: FastifyRequest,
			localName: string,
			stateName: string,
			federalName: string
		) => { local: TaxItem; state: TaxItem; federal: TaxItem };
	}
}
const fastifyTax = async (app: FastifyInstance, options) => {
	const getTaxItems = async (
		req: FastifyRequest,
		localName: string,
		stateName: string,
		federalName: string
	) => {
		const local = await req.em.findOne(TaxItem, {
			location: localName,
			level: Level.LOCAL,
		});
		console.log(local);
		const state = await req.em.findOne(TaxItem, {
			location: stateName,
			level: Level.STATE,
		});
		console.log(state);
		const federal = await req.em.findOne(TaxItem, {
			location: federalName,
			level: Level.FEDERAL,
		});
		console.log(federal);

		return { local, state, federal };
	};
	app.decorate("getTaxItems", getTaxItems);
};

export const FastifyTaxPlugin = fp(fastifyTax, {
	name: "getTaxItems",
});
