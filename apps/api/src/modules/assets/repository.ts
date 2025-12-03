import { Inject, Service } from "@asenajs/asena/server";
import { HttpException } from "@asenajs/ergenecore";
import { and, eq } from "drizzle-orm";
import { DatabaseService } from "@/db";
import * as schema from "@/db/schema";

@Service({
	name: "AssetsRepository",
})
export class AssetsRepository {
	@Inject(DatabaseService)
	private db: DatabaseService;

	async get(assetId: string) {
		const asset = await this.db.client.query.assets.findFirst({
			where: (t, { eq }) => eq(t.id, assetId),
		});

		if (!asset) {
			throw new HttpException(404, {
				message: "Asset not found",
			});
		}

		return asset;
	}

	async create(squirrelId: string, url: string) {
		const result = await this.db.client.transaction(async (tx) => {
			const res = await tx.query.assets.findFirst({
				where: (t, { eq }) => eq(t.squirrelId, squirrelId),
				orderBy: (t, { desc }) => [desc(t.order)],
				columns: {
					order: true,
				},
			});

			const lastOrder = res ? res.order : 0;

			const insertRes = await tx
				.insert(schema.assets)
				.values({
					squirrelId,
					url,
					order: lastOrder + 1,
				})
				.returning();

			return insertRes[0];
		});

		return result;
	}

	async delete(id: string, assetId: string) {
		await this.db.client
			.delete(schema.assets)
			.where(
				and(eq(schema.assets.id, assetId), eq(schema.assets.squirrelId, id)),
			);
	}
}
