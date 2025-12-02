import { Inject, Service } from "@asenajs/asena/server";
import { Pagination } from "@/lib/pagination";
import { SquirrelsRepository } from "./repository";
import type {
	CreateInput,
	CreateOutput,
	GetOutput,
	ListOutput,
} from "./validators";

@Service({
	name: "SquirrelsService",
})
export class SquirrelsService {
	@Inject(SquirrelsRepository)
	private repo: SquirrelsRepository;

	async list(pagination: Pagination.QueryParams): Promise<ListOutput> {
		const result = await this.repo.list(pagination);

		return {
			squirrels: result.squirrels,
			pagination: Pagination.compute(pagination, result.totalRecords),
		};
	}

	async get(id: string): Promise<GetOutput> {
		const result = await this.repo.get(id);

		return {
			squirrel: result,
		};
	}

	async create(userId: string, data: CreateInput): Promise<CreateOutput> {
		const result = await this.repo.create(data);

		console.log(`Created squirrel with ID ${result.id} by user ${userId}`);

		return {
			squirrel: result,
		};
	}

	async update(id: string, data: any) {}

	async delete(id: string) {}
}
