import { FastifyInstance, FastifyRequest } from "fastify";
import { Level, TaxRate } from "../db/entities/Tax.js";
import fp from "fastify-plugin";

declare module "fastify" {
	interface FastifyInstance {
		getTaxItems: (
			req: FastifyRequest,
			localName: string,
			stateName: string,
			federalName: string,
			capitalGainsName: string,
			ficaName: string
		) => { local: TaxRate; state: TaxRate; federal: TaxRate; capitalGains: TaxRate; fica: TaxRate };
	}
}
const fastifyTax = async (app: FastifyInstance, options) => {
	const getTaxItems = async (
		req: FastifyRequest,
		localName: string,
		stateName: string,
		federalName: string,
		capitalGainsName: string,
		ficaName: string
	) => {
		const local =
			localName != ""
				? await req.em.findOne(TaxRate, {
						location: localName,
						level: Level.LOCAL,
				  })
				: null;
		const state =
			stateName != ""
				? await req.em.findOne(TaxRate, {
						location: stateName,
						level: Level.STATE,
				  })
				: null;
		const federal =
			federalName != ""
				? await req.em.findOne(TaxRate, {
						location: federalName,
						level: Level.FEDERAL,
				  })
				: null;
		const capitalGains =
			capitalGainsName != ""
				? await req.em.findOne(TaxRate, {
						location: capitalGainsName,
						level: Level.CAPGAINS,
				  })
				: null;
		const fica =
			ficaName != ""
				? await req.em.findOne(TaxRate, {
						location: ficaName,
						level: Level.FICA,
				  })
				: null;
		return { local, state, federal, capitalGains, fica };
	};
	app.decorate("getTaxItems", getTaxItems);
};

export const FastifyTaxPlugin = fp(fastifyTax, {
	name: "getTaxItems",
});
