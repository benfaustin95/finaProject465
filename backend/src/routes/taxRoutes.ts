import { FastifyInstance } from "fastify";
import { taxAccumulator, TaxBody } from "../db/types.js";
import { Level, TaxRate } from "../db/entities/Tax.js";

async function taxRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}

	app.post<{ Body: TaxBody }>("/taxRate", async (req, reply) => {
		const toAdd = req.body;

		try {
			const taxRate = await req.em.create(TaxRate, toAdd);
			await req.em.flush();
			return reply.send(taxRate);
		} catch (err) {
			return reply.status(500).send(err);
		}
	});

	app.delete<{ Body: TaxBody }>("/taxRate", async (req, reply) => {
		const toDelete = req.body;

		try {
			const taxRate = await req.em.getReference(TaxRate, [toDelete.level, toDelete.location]);

			await req.em.removeAndFlush(taxRate);

			return reply.send(taxRate);
		} catch (err) {
			reply.status(500).send(err);
		}
	});

	app.get("/taxRate/fica", async (req, reply) => {
		try {
			const taxRates = await req.em.find(TaxRate, { level: Level.FICA });
			return reply.send(taxRates);
		} catch (err) {
			reply.status(500).send(err);
		}
	});

	app.get("/taxRate/capitalGains", async (req, reply) => {
		try {
			const taxRates = await req.em.find(TaxRate, { level: Level.CAPGAINS });
			return reply.send(taxRates);
		} catch (err) {
			reply.status(500).send(err);
		}
	});

	app.get("/taxRate/federal", async (req, reply) => {
		try {
			const taxRates = await req.em.find(TaxRate, { level: Level.FEDERAL });
			return reply.send(taxRates);
		} catch (err) {
			reply.status(500).send(err);
		}
	});

	app.get("/taxRate/state", async (req, reply) => {
		try {
			const taxRates = await req.em.find(TaxRate, { level: Level.STATE });
			return reply.send(taxRates);
		} catch (err) {
			reply.status(500).send(err);
		}
	});

	app.get("/taxRate/local", async (req, reply) => {
		try {
			const taxRates = await req.em.find(TaxRate, { level: Level.LOCAL });
			return reply.send(taxRates);
		} catch (err) {
			reply.status(500).send(err);
		}
	});
}

export default taxRoutes;
