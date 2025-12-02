import { Controller } from "@asenajs/asena/server";
import { Get } from "@asenajs/asena/web";
import type { Context } from "@asenajs/ergenecore";

@Controller({ path: "/asena" })
export class AsenaController {
	@Get("/")
	public async helloAsena(context: Context) {
		return context.send("Hello asena");
	}
}
