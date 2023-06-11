import { FastifyInstance } from "fastify";
import DividendRoutes from "./dividendRoutes.js";
import FinancialAssetRoutes from "./financialAssetRoutes.js";
import RentalAssetRoutes from "./RentalAssetRoutes.js";
import OneTimeIncomeRoutes from "./oneTimeIncomeRoutes.js";
import MacroReportRoutes from "./macroReportRoutes.js";
import BudgetItemRoutes from "./budgetItemRoutes.js";
import CapAssetRoutes from "./capAssetRoutes.js";
import UserRoutes from "./userRoutes.js";
import TaxRoutes from "./taxRoutes.js";

async function GeneralRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("bad instance");
	}
	await app.register(MacroReportRoutes, {});
	await app.register(BudgetItemRoutes, {});
	await app.register(CapAssetRoutes, {});
	await app.register(UserRoutes, {});
	await app.register(DividendRoutes, {});
	await app.register(FinancialAssetRoutes, {});
	await app.register(RentalAssetRoutes, {});
	await app.register(OneTimeIncomeRoutes, {});
	await app.register(TaxRoutes, {});
}

export default GeneralRoutes;
