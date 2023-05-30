import { ManyToOne, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import type { Ref, Rel } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { User } from "./User.js";
import { TaxItem } from "./Tax.js";

export class BaseInput extends BaseEntity {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	owner!: Rel<User>;

	@Property()
	@Unique()
	name!: string;

	@Property()
	note: string = "";

	@Property({ columnType: "float" })
	growthRate: number = 1; //always assumed annual and converted to other

	@ManyToOne({ nullable: true, eager: true })
	state?: TaxItem = null;

	@ManyToOne({ nullable: true, eager: true })
	federal?: TaxItem = null;

	@ManyToOne({ nullable: true, eager: true })
	local?: TaxItem = null;

	@ManyToOne({ nullable: true, eager: true })
	capitalGains?: TaxItem = null;
}
