import { BaseInput } from "./BaseInput.js";
import { Entity, Enum, Property } from "@mikro-orm/core";
import { Recurrence } from "./budgetItem.js";

@Entity()
export class CapAsset extends BaseInput {
	@Property()
	start!: Date;

	@Property()
	end: Date;

	@Property()
	income!: number;

	@Enum(() => CapAssetType)
	type!: CapAssetType;

	@Property()
	recurrence!: Recurrence;
}

export enum CapAssetType {
	HUMAN = "human capital",
	NONTAXABLEANNUITY = "non-taxable annuity",
	SOCIAL = "social capital",
}
