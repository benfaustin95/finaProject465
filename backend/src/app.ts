import Fastify from "fastify";
import cors from "@fastify/cors";
import { FastifySearchHttpMethodPlugin } from "./plugins/http_search.js";
import { FastifyMikroOrmPlugin } from "./plugins/mikro.js";
import config from "./db/mikro-orm.config.js";
import UserRoutes from "./routes/userRoutes.js";
import { FastifyMacroReportsPlugin } from "./plugins/macroBudgetReport.js";
import MacroReportRoutes from "./routes/macroReportRoutes.js";
import BudgetItemRoutes from "./routes/budgetItemRoutes.js";
import CapAssetRoutes from "./routes/capAssetRoutes.js";
import { FastifyTaxPlugin } from "./plugins/tax.js";
import DividendRoutes from "./routes/dividendRoutes.js";
import FinancialAssetRoutes from "./routes/financialAssetRoutes.js";
import RentalAssetRoutes from "./routes/RentalAssetRoutes.js";
import OneTimeIncomeRoutes from "./routes/oneTimeIncomeRoutes.js";
import {FastifyMicroReportsPlugin} from "./plugins/microBudgetReport.js";
import MicroReportRoute from "./routes/microReportRoute.js";

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
});

await app.register(FastifyMikroOrmPlugin, config);
await app.register(FastifySearchHttpMethodPlugin, {});
await app.register(UserRoutes, {});
await app.register(FastifyMacroReportsPlugin, {});
await app.register(MacroReportRoutes, {});
await app.register(BudgetItemRoutes, {});
await app.register(CapAssetRoutes, {});
await app.register(FastifyTaxPlugin, {});
await app.register(DividendRoutes, {});
await app.register(FinancialAssetRoutes, {});
await app.register(RentalAssetRoutes, {});
await app.register(OneTimeIncomeRoutes, {});
await app.register(FastifyMicroReportsPlugin,{})
await app.register(MicroReportRoute, {});
export default app;
