import { Inject, Service } from "@asenajs/asena/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { DatabaseService, type TDatabaseClient } from "@/db";
import * as schema from "@/db/schema";

@Service({
	name: "AuthService",
})
export class AuthService {
	private _client: AuthClient;

	@Inject(DatabaseService)
	private db: DatabaseService;

	constructor() {
		this._client = init(this.db.client);
	}

	get client() {
		return this._client;
	}
}

function init(db: TDatabaseClient) {
	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",
			schema: schema,
			usePlural: true,
		}),
		trustedOrigins: ["localhost:3000", "localhost:5000"],
		appName: "Squirrel Facts",
		emailAndPassword: {
			enabled: true,
		},
		advanced: {
			defaultCookieAttributes: {
				sameSite: "Lax",
				secure: true,
				httpOnly: true,
			},
		},
	});
}

export type AuthClient = ReturnType<typeof init>;
