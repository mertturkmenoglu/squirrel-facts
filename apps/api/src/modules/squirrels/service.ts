import { Inject, Service } from "@asenajs/asena/server";
import { Pagination } from "@/lib/pagination";
import {
	createPathname,
	getFilenameFromUrl,
	StorageService,
	type TStorageClient,
} from "@/lib/storage";
import { SquirrelsRepository } from "./repository";
import type {
	CreateInput,
	CreateOutput,
	GetOutput,
	ListOutput,
	UpdateInputBody,
	UpdateOutput,
} from "./validators";

@Service({
	name: "SquirrelsService",
})
export class SquirrelsService {
	@Inject(SquirrelsRepository)
	private repo: SquirrelsRepository;

	@Inject(StorageService, (service: StorageService) => service.client)
	private storage: TStorageClient;

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

	async update(
		userId: string,
		id: string,
		data: UpdateInputBody,
	): Promise<UpdateOutput> {
		const result = await this.repo.update(id, data);

		console.log(`Updated squirrel with ID ${id} by user ${userId}`);

		return {
			squirrel: result,
		};
	}

	async delete(userId: string, id: string): Promise<void> {
		const result = await this.get(id);

		await this.repo.delete(id);
		console.log(`Deleted squirrel with ID ${id} by user ${userId}`);

		// Todo: In the future, handle this by emitting an event and handling it in the background
		// while returning the response immediately.
		for (const asset of result.squirrel.assets) {
			try {
				const filename = getFilenameFromUrl(asset.url);
				const path = createPathname("assets", filename);

				const exists = await this.storage.exists(path);

				if (exists) {
					await this.storage.delete(path);
					console.log(
						`Deleted asset at URL ${asset.url} for squirrel ID ${id}`,
					);
				}
			} catch (_err) {
				console.warn(
					`Failed to delete asset at URL ${asset.url} for squirrel ID ${id}`,
				);
			}
		}
	}
}
