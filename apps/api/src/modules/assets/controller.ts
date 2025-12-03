import { Controller, Delete, Inject, Post } from "@asenajs/asena/server";
import { type Context, HttpException } from "@asenajs/ergenecore";
import { Authn } from "@/middlewares/authn";
import { AssetsService } from "./service";
import { uploadInput, uploadOutput } from "./validators";

@Controller({
	path: "/assets",
	middlewares: [Authn],
})
export class AssetsController {
	@Inject(AssetsService)
	private service: AssetsService;

	@Post("/:id/upload")
	async upload(context: Context) {
		const id = context.getParam("id");
		const body = await context.getParseBody();
		const result = uploadInput.safeParse(body);

		if (!result.success) {
			throw new HttpException(400, {
				message: "Invalid upload input data",
			});
		}

		const res = await this.service.upload(id, result.data.file);

		const outputResult = uploadOutput.safeParse(res);

		if (!outputResult.success) {
			throw new HttpException(500, {
				message: "Output validation failed",
			});
		}

		return context.send(outputResult.data, 201);
	}

	@Delete("/:id/:assetId")
	async delete(context: Context) {
		const id = context.getParam("id");
		const assetId = context.getParam("assetId");
		await this.service.delete(id, assetId);
		return context.send(null, 204);
	}
}
