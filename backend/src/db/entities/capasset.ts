import { BaseInput } from "./BaseInput.js";
import { Entity, Property } from "@mikro-orm/core";
import { Recurrence } from "./budgetItem.js";

@Entity()
export class CapAsset extends BaseInput {
	@Property()
	start!: Date;

	@Property()
	end: Date;

	@Property()
	income!: number;

	@Property()
	recurrence!: Recurrence;
}
