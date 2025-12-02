import { Middleware } from "@asenajs/asena/server";
import { ValidationService } from "@asenajs/ergenecore";
import { Pagination } from "@/lib/pagination";

@Middleware({ validator: true })
export class ListSquirrelsValidator extends ValidationService {
	query() {
		return Pagination.queryParamsSchema;
	}
}
