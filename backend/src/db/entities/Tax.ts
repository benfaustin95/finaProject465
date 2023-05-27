import { Entity, Enum, Property } from "@mikro-orm/core";

@Entity()
export class TaxItem {
	@Enum({ items: () => Level, primary: true })
	level!: Level;

	@Property({columnType: "float"})
	rate!: number;

	@Property({ primary: true })
	location!: string;
}

export enum Level {
	STATE = "state",
	LOCAL = "local",
	FEDERAL = "federal",
}
