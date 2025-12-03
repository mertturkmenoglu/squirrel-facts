import { Middleware } from "@asenajs/asena/server";
import {
	type ValidationSchemaWithHook,
	ValidationService,
} from "@asenajs/ergenecore";
import z from "zod";
import { $, $insert } from "@/db/schema";
import { Pagination } from "@/lib/pagination";

const squirrel = $.squirrel.extend(
	z.object({
		assets: z.array($.asset),
	}).shape,
);

@Middleware({ validator: true })
export class ListValidator extends ValidationService {
	query(): ValidationSchemaWithHook {
		return {
			schema: Pagination.queryParamsSchema,
			hook: (result: Pagination.QueryParams, context) => {
				// Add the validated pagination params to context
				context.setValue("pagination", result);
			},
		};
	}
}

export const listOutput = z.object({
	squirrels: z.array(squirrel),
	pagination: Pagination.schema,
});

export type ListOutput = z.infer<typeof listOutput>;

export const getInput = $.squirrel.pick({ id: true });

export type GetInput = z.infer<typeof getInput>;

@Middleware({ validator: true })
export class GetValidator extends ValidationService {
	param() {
		return getInput;
	}
}

export const getOutput = z.object({
	squirrel: squirrel,
});

export type GetOutput = z.infer<typeof getOutput>;

export const createInput = $insert.squirrel;

export type CreateInput = z.infer<typeof createInput>;

@Middleware({ validator: true })
export class CreateValidator extends ValidationService {
	json() {
		return createInput;
	}
}

export const createOutput = z.object({
	squirrel: squirrel,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const updateInputParams = $.squirrel.pick({ id: true });

export type UpdateInputParams = z.infer<typeof updateInputParams>;

export const updateInputBody = $insert.squirrel.partial();

export type UpdateInputBody = z.infer<typeof updateInputBody>;

@Middleware({ validator: true })
export class UpdateValidator extends ValidationService {
	param() {
		return updateInputParams;
	}

	json() {
		return updateInputBody;
	}
}

export const updateOutput = z.object({
	squirrel: squirrel,
});

export type UpdateOutput = z.infer<typeof updateOutput>;

export const deleteInputParams = $.squirrel.pick({ id: true });

export type DeleteInputParams = z.infer<typeof deleteInputParams>;

@Middleware({ validator: true })
export class DeleteValidator extends ValidationService {
	param() {
		return deleteInputParams;
	}
}
