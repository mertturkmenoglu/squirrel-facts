import { Inject, Service } from "@asenajs/asena/server";
import { HttpException } from "@asenajs/ergenecore";
import { eq } from "drizzle-orm";
import { DatabaseService } from "@/db";
import * as schema from "@/db/schema";
import { Pagination } from "@/lib/pagination";
import type { CreateInput, UpdateInputBody } from "./validators";

@Service({
	name: "SquirrelsRepository",
})
export class SquirrelsRepository {
	@Inject(DatabaseService)
	private db: DatabaseService;

	async list(pagination: Pagination.QueryParams) {
		const offset = Pagination.getOffset(pagination);

		const squirrels = await this.db.client.query.squirrels.findMany({
			orderBy: (t, { asc }) => [asc(t.scientificName)],
			offset,
			limit: pagination.pageSize,
			with: {
				assets: true,
			},
		});

		const totalRecords = await this.db.client.$count(schema.squirrels);

		return {
			squirrels,
			totalRecords,
		};
	}

	async get(id: string) {
		const squirrel = await this.db.client.query.squirrels.findFirst({
			where: (t, { eq }) => eq(t.id, id),
			with: {
				assets: true,
			},
		});

		if (!squirrel) {
			throw new HttpException(404, {
				message: `Squirrel with ID ${id} not found`,
			});
		}

		return squirrel;
	}

	async create(data: CreateInput) {
		const result = await this.db.client.transaction(async (tx) => {
			const [result] = await tx
				.insert(schema.squirrels)
				.values(data)
				.returning({
					id: schema.squirrels.id,
				});

			if (!result) {
				throw new HttpException(500, {
					message: "Failed to create squirrel",
				});
			}

			const squirrel = await this.get(result.id.toString());

			return squirrel;
		});

		return result;
	}

	async update(id: string, data: UpdateInputBody) {
		const result = await this.db.client.transaction(async (tx) => {
			await tx
				.update(schema.squirrels)
				.set(data)
				.where(eq(schema.squirrels.id, id));

			const squirrel = await this.get(id);

			return squirrel;
		});

		return result;
	}

	async delete(id: string) {
		await this.db.client
			.delete(schema.squirrels)
			.where(eq(schema.squirrels.id, id));
	}
}
