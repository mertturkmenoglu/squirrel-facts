/** biome-ignore-all lint/complexity/useLiteralKeys: No need */
import { Service } from "@asenajs/asena/server";
import { Disk } from "flydrive";
import { FSDriver } from "flydrive/drivers/fs";
import type { SignedURLOptions } from "flydrive/types";

@Service({
	name: "StorageService",
})
export class StorageService {
	private _client: TStorageClient;

	constructor() {
		this._client = init();
	}

	get client(): TStorageClient {
		return this._client;
	}
}

function init() {
	const fsDriver = new FSDriver({
		location: new URL("../../../uploads", import.meta.url),
		visibility: "public",
		urlBuilder: {
			async generateURL(key: string, _filePath: string) {
				return `http://localhost:${process.env["PORT"]}/uploads/${key}`;
			},

			async generateSignedURL(
				key: string,
				_filePath: string,
				_options: SignedURLOptions,
			) {
				/**
				 * It is up to your application to decide how to create and verify
				 * signed URLs. Do note this method can be async.
				 */
				return `http://localhost:${process.env["PORT"]}/uploads/${key}`;
			},
		},
	});

	return new Disk(fsDriver);
}

export type TStorageClient = ReturnType<typeof init>;
