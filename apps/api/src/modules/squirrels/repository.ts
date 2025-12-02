import { Inject, Service } from "@asenajs/asena/server";
import { DatabaseService } from "@/db";

@Service({
	name: "SquirrelsRepository",
})
export class SquirrelsRepository {
	@Inject(DatabaseService)
	private db: DatabaseService;

	async list() {
		this.db.client.query.squirrels.findMany({
			orderBy: (t, { asc }) => [asc(t.scientificName)],
		});
	}

	async get(id: string) {}

	async create(data: any) {}

	async update(id: string, data: any) {}

	async delete(id: string) {}
}
