import {ManyToOne, PrimaryKey, Property, Unique} from "@mikro-orm/core";
import type { Ref, Rel} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { User } from "./User.js";
import { TaxItem } from "./Tax.js";

export class BaseInput extends BaseEntity {
	@PrimaryKey()
	id!:number;

	@ManyToOne()
	owner!: Rel<User>;

	@Property()
	@Unique()
	name!: string;

	@Property()
	note: string = "";

	@Property({columnType: "float" })
	growthRate: number = 1;//always assumed annual and converted to other

	@ManyToOne({ nullable: true })
	state: Rel<TaxItem> | null = null;

	@ManyToOne({ nullable: true })
	federal: Rel<TaxItem> | null = null;

	@ManyToOne({ nullable: true })
	local: Rel<TaxItem> | null = null;
}
