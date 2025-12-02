import { Service } from "@asenajs/asena/server";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

@Service({
	name: "DatabaseService",
})
export class DatabaseService {
	private _client: TDatabaseClient;

	constructor() {
		this._client = init();
	}

	get client() {
		return this._client;
	}
}

function init() {
	return drizzle({
		connection: {
			connectionString: process.env["DATABASE_URL"] ?? "",
			ssl: process.env.NODE_ENV === "production",
		},
		schema,
	});
}

export type TDatabaseClient = ReturnType<typeof init>;
