import { BaseInput } from "./BaseInput.js";
import { Entity, ManyToOne, OneToOne, Property } from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core";
import { FinancialAsset } from "./financialasset.js";

@Entity()
export class Dividend extends BaseInput {
	@Property({ columnType: "float" })
	rate!: number;

	@ManyToOne()
	asset!: Rel<FinancialAsset>;
}
