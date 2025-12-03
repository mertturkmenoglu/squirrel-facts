import {
	Controller,
	Delete,
	Get,
	Inject,
	Patch,
	Post,
} from "@asenajs/asena/server";
import { type Context, HttpException } from "@asenajs/ergenecore";
import type { Pagination } from "@/lib/pagination";
import { Authn, type TSession } from "@/middlewares/authn";
import { SquirrelsService } from "./service";
import {
	type CreateInput,
	CreateValidator,
	GetValidator,
	getOutput,
	ListValidator,
	listOutput,
	type UpdateInputBody,
	UpdateValidator,
	updateOutput,
} from "./validators";

@Controller({
	path: "/squirrels",
})
export class SquirrelsController {
	@Inject(SquirrelsService)
	private service: SquirrelsService;

	@Get({
		path: "/",
		description: "List squirrel entities with pagination",
		validator: ListValidator,
	})
	async list(context: Context) {
		const pagination = context.getValue<Pagination.QueryParams>("pagination");
		const result = await this.service.list(pagination);
		const parseResult = listOutput.safeParse(result);

		if (!parseResult.success) {
			throw new HttpException(500, {
				message: "Output validation failed",
			});
		}

		return context.send(parseResult.data);
	}

	@Get({
		path: "/:id",
		description: "Get a squirrel entity by ID",
		validator: GetValidator,
	})
	async get(context: Context) {
		const id = context.getParam("id");
		const result = await this.service.get(id);
		const parseResult = getOutput.safeParse(result);

		if (!parseResult.success) {
			throw new HttpException(500, {
				message: "Output validation failed",
			});
		}

		return context.send(parseResult.data);
	}

	@Post({
		path: "/",
		description: "Create a new squirrel entity",
		middlewares: [Authn],
		validator: CreateValidator,
	})
	async create(context: Context) {
		const session = context.getValue<TSession>("session");
		const userId = session.user.id;
		const body = await context.getBody<CreateInput>();
		const result = await this.service.create(userId, body);
		const parseResult = getOutput.safeParse(result);

		if (!parseResult.success) {
			throw new HttpException(500, {
				message: "Output validation failed",
			});
		}

		return context.send(parseResult.data, 201);
	}

	@Patch({
		path: "/:id",
		description: "Update a squirrel entity by ID",
		middlewares: [Authn],
		validator: UpdateValidator,
	})
	async update(context: Context) {
		const session = context.getValue<TSession>("session");
		const userId = session.user.id;
		const id = context.getParam("id");
		const body = await context.getBody<UpdateInputBody>();
		const result = await this.service.update(userId, id, body);
		const parseResult = updateOutput.safeParse(result);

		if (!parseResult.success) {
			throw new HttpException(500, {
				message: "Output validation failed",
			});
		}

		return context.send(parseResult.data);
	}

	@Delete("/:id")
	async delete(context: Context) {
		const session = context.getValue<TSession>("session");
		const userId = session.user.id;
		const id = context.getParam("id");
		await this.service.delete(userId, id);
		return context.send(null, 204);
	}
}
