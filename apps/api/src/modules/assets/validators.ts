import { Middleware } from "@asenajs/asena/server";
import { ValidationService } from "@asenajs/ergenecore";
import z from "zod";
import { $ } from "@/db/schema";

export const uploadInputParams = $.asset.pick({
	id: true,
});

export type UploadInputParams = z.infer<typeof uploadInputParams>;

export const uploadInput = z.object({
	file: z.instanceof(File),
});

@Middleware({ validator: true })
export class UploadValidator extends ValidationService {
	param() {
		return uploadInputParams;
	}

	form() {
		return uploadInput;
	}
}

export const uploadOutput = z.object({
	asset: $.asset,
});

export type UploadOutput = z.infer<typeof uploadOutput>;

export const deleteInputParams = z.object({
	id: $.asset.shape.squirrelId,
	assetId: $.asset.shape.id,
});

export type DeleteInputParams = z.infer<typeof deleteInputParams>;

@Middleware({ validator: true })
export class DeleteValidator extends ValidationService {
	param() {
		return deleteInputParams;
	}
}
