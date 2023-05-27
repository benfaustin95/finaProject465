import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { User} from "../entities/User.js";
import bcrypt from "bcrypt";


export class UserSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {

		// https://mikro-orm.io/docs/seeding#shared-context
		context.user1 = em.create(User, {
			name: "User1",
			email: "email@email.com",
			birthday: "1/1/1966"
		});

		context.user2 = em.create(User, {
			name: "User2",
			email: "email2@email.com",
			birthday: "1/1/1976"
		});

		context.user3 = em.create(User, {
			name: "User3",
			email: "email3@email.com",
			birthday: "1/1/1986"
		});

		context.user4 = em.create(User, {
			name: "User4",
			email: "email4@email.com",
			birthday: "1/1/1996"
		});

		context.user5 = em.create(User, {
			name: "User5",
			email: "email5@email.com",
			birthday: "1/1/1946"
		});
	}
}
