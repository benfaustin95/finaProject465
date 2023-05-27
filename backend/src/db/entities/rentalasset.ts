import { Entity, Property } from "@mikro-orm/core";
import { RFBase } from "./RFBase.js";

@Entity()
export class RentalAsset extends RFBase {
	@Property()
	owed!: number;

	@Property()
	maintenanceExpense!: number;

	@Property()
	grossIncome!: number;
}
