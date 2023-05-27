import { Cascade, Collection, Entity, OneToMany, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { BudgetItem } from "./budgetItem.js";
import { FinancialAsset } from "./financialasset.js";
import { CapAsset } from "./capasset.js";
import { RentalAsset } from "./rentalasset.js";
import { Dividend } from "./Dividend.js";
import {OneTimeIncome} from "./OneTimeIncome.js";

@Entity({ tableName: "users" })
export class User extends BaseEntity {
	@Property({primary: true})
	email!: string;

	@Property()
	name!: string;

	@Property()
	birthday!: Date;

	@OneToMany(() => BudgetItem, (owner) => owner.owner, {
		cascade: [Cascade.PERSIST, Cascade.REMOVE],
	})
	budgetItems!: Collection<BudgetItem>;

	@OneToMany(() => FinancialAsset, (owner) => owner.owner, {
		cascade: [Cascade.PERSIST, Cascade.REMOVE],
	})
	financialAssets!: Collection<FinancialAsset>;

	@OneToMany(() => CapAsset, (owner) => owner.owner, { cascade: [Cascade.PERSIST, Cascade.REMOVE] })
	capitalAssets!: Collection<CapAsset>;

	@OneToMany(() => RentalAsset, (owner) => owner.owner, {
		cascade: [Cascade.PERSIST, Cascade.REMOVE],
	})
	RentalAssets!: Collection<RentalAsset>;

	@OneToMany(() => Dividend, (owner) => owner.owner, { cascade: [Cascade.PERSIST, Cascade.REMOVE] })
	Dividends!: Collection<Dividend>;

	@OneToMany(() => OneTimeIncome, (owner) => owner.owner, { cascade: [Cascade.PERSIST, Cascade.REMOVE] })
	OneTimeIncomes!: Collection<OneTimeIncome>;
}
