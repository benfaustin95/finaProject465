import {Entity, Property} from "@mikro-orm/core";
import {BaseInput} from "./BaseInput.js";

@Entity()
export class OneTimeIncome extends BaseInput {
	@Property()
	date!: Date;

	@Property()
	cashBasis!: number;
}

