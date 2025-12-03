import { Controller } from "@asenajs/asena/server";
import { Get } from "@asenajs/asena/web";
import { StaticServeMiddleware } from "./middleware";

@Controller({ path: "/uploads" })
export class StaticController {
	@Get({ path: "/*", staticServe: StaticServeMiddleware })
	public static() {}
}
