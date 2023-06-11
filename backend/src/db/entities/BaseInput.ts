import { ManyToOne, Property } from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { User } from "./User.js";
import { TaxRate } from "./Tax.js";

export class BaseInput extends BaseEntity {
	@ManyToOne()
	owner!: Rel<User>;

	@Property()
	name!: string;

	@Property()
	note: string = "";

	@Property({ columnType: "float" })
	growthRate: number = 1; //always assumed annual and converted to other

	@ManyToOne({ nullable: true, eager: true })
	state?: TaxRate = null;

	@ManyToOne({ nullable: true, eager: true })
	federal?: TaxRate = null;

	@ManyToOne({ nullable: true, eager: true })
	local?: TaxRate = null;

	@ManyToOne({ nullable: true, eager: true })
	capitalGains?: TaxRate = null;

	@ManyToOne({ nullable: true, eager: true })
	fica?: TaxRate = null;
}
