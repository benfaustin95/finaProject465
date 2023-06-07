import { Property, Unique } from "@mikro-orm/core";
import { BaseInput } from "./BaseInput.js";

export class RFBase extends BaseInput {
	@Property()
	totalValue!: number;

	@Property()
	costBasis: number = 0;

	@Property()
	wPriority!: number;
}
