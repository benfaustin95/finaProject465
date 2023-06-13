import Fastify from "fastify";
import cors from "@fastify/cors";
import { FastifySearchHttpMethodPlugin } from "./plugins/http_search.js";
import { FastifyMikroOrmPlugin } from "./plugins/mikro.js";
import config from "./db/mikro-orm.config.js";
import { FastifyMacroReportsPlugin } from "./plugins/macroBudgetReport.js";
import { FastifyMicroReportsPlugin } from "./plugins/microBudgetReport.js";
import MicroReportRoute from "./routes/microReportRoute.js";
import { AuthPlugin } from "./plugins/auth.js";
import GeneralRoutes from "./routes/generalRoutes.js";
import { FastifyValidationPlugin } from "./plugins/validateInputs.js";
import { FastifyTaxPlugin } from "./plugins/taxItemsPlugin.js";

const envToLogger = {
	development: {
		transport: {
			target: "pino-pretty",
			options: {
				translateTime: "HH:MM:ss Z",
				ignore: "pid,hostname",
			},
		},
		level: "debug",
	},
	production: {
		level: "error",
	},
	test: {
		transport: {
			target: "pino-pretty",
			options: {
				translateTime: "HH:MM:ss Z",
				ignore: "pid,hostname",
			},
		},
		level: "warn",
	},
};

const app = Fastify({
	logger: envToLogger[process.env.NODE_ENV],
});

await app.register(cors, {
	origin: (origin, cb) => {
		cb(null, true);
	},
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "SEARCH"],
});

await app.register(FastifyMikroOrmPlugin, config);
await app.register(FastifySearchHttpMethodPlugin, {});
await app.register(FastifyMacroReportsPlugin, {});
await app.register(FastifyTaxPlugin, {});
await app.register(FastifyMicroReportsPlugin, {});
await app.register(MicroReportRoute, {});
await app.register(AuthPlugin, {});
await app.register(GeneralRoutes, {});
await app.register(FastifyValidationPlugin, {});

export default app;
