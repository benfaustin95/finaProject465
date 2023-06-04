import { Entity, Enum, PrimaryKey, PrimaryKeyType, Property } from "@mikro-orm/core";

@Entity()
export class TaxRate {
	@PrimaryKey()
	@Enum({ items: () => Level })
	level!: Level;

	@Property({ columnType: "float" })
	rate!: number;

	@PrimaryKey()
	location!: string;

	[PrimaryKeyType]?: [Level, string];
}
export enum Level {
	STATE = "state",
	LOCAL = "local",
	FEDERAL = "federal",
	CAPGAINS = "capgains",
	FICA = "FICA",
}
