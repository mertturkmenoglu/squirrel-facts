import { Inject, Service } from "@asenajs/asena/server";
import { HttpException } from "@asenajs/ergenecore";
import { fileTypeFromBlob } from "file-type";
import {
	createPathname,
	getFilenameFromUrl,
	StorageService,
	type TStorageClient,
} from "@/lib/storage";
import { AssetsRepository } from "./repository";
import type { UploadOutput } from "./validators";

@Service({
	name: "AssetsService",
})
export class AssetsService {
	@Inject(AssetsRepository)
	private repo: AssetsRepository;

	@Inject(StorageService, (service: StorageService) => service.client)
	private storage: TStorageClient;

	async upload(id: string, file: File): Promise<UploadOutput> {
		const typeResult = await fileTypeFromBlob(file);

		if (!typeResult) {
			throw new HttpException(422, {
				message: "Unable to determine file type",
			});
		}

		if (!["image/jpeg", "image/png", "image/webp"].includes(typeResult.mime)) {
			throw new HttpException(422, {
				message: "Unsupported file type",
			});
		}

		const name = `${Bun.randomUUIDv7()}.${typeResult.ext}`;

		const path = createPathname("assets", name);
		const ab = await file.arrayBuffer();

		await this.storage.put(path, new Uint8Array(ab), {
			contentType: typeResult.mime,
		});

		const url = await this.storage.getUrl(path);

		const asset = await this.repo.create(id, url);

		return {
			asset,
		};
	}

	async delete(id: string, assetId: string): Promise<void> {
		const asset = await this.repo.get(assetId);

		await this.repo.delete(id, assetId);

		// Todo: In the future, handle this by emitting an event and handling it in the background
		// while returning the response immediately.
		try {
			const filename = getFilenameFromUrl(asset.url);
			const path = createPathname("assets", filename);

			const exists = await this.storage.exists(path);

			if (exists) {
				await this.storage.delete(path);
			}
		} catch (error) {
			// Log the error but do not throw, as the asset record is already deleted
			console.error(
				`Failed to delete asset file for assetId ${assetId}:`,
				error,
			);
		}
	}
}
