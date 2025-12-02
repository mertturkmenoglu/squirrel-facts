import {
	Controller,
	Delete,
	Get,
	Inject,
	Patch,
	Post,
} from "@asenajs/asena/server";
import type { Context } from "@asenajs/ergenecore";
import { Authn, type TSession } from "@/middlewares/authn";
import { SquirrelsService } from "./service";
import { ListSquirrelsValidator } from "./validators";

@Controller({
	path: "/squirrels",
})
export class SquirrelsController {
	@Inject(SquirrelsService)
	private service: SquirrelsService;

	@Get({
		path: "/",
		description: "List squirrel entities with pagination",
		validator: ListSquirrelsValidator,
	})
	async list(context: Context) {
		return this.service.list();
	}

	@Get("/:id")
	async get(context: Context) {
		return context.send("Not implemented", 501);
	}

	@Post({
		path: "/",
		description: "Create a new squirrel entity",
		middlewares: [Authn],
	})
	async create(context: Context) {
		const session = context.getValue<TSession>("session");
		return context.send("Not implemented", 501);
	}

	@Patch("/:id")
	async update(context: Context) {
		return context.send("Not implemented", 501);
	}

	@Delete("/:id")
	async delete(context: Context) {
		return context.send("Not implemented", 501);
	}
}
