import { Cascade, Collection, Entity, Enum, OneToMany, OneToOne, Property } from "@mikro-orm/core";
import { RFBase } from "./RFBase.js";
import { Dividend } from "./Dividend.js";

@Entity()
export class FinancialAsset extends RFBase {
	@OneToMany(() => Dividend, (owner) => owner.asset, { cascade: [Cascade.PERSIST, Cascade.REMOVE] })
	Dividends!: Collection<Dividend>;
}
