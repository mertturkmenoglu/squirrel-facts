import { Controller, Get } from "@asenajs/asena/server";
import type { Context } from "@asenajs/ergenecore";

@Controller({
	path: "/",
})
export class HealthController {
	@Get({
		path: "/",
	})
	async healthCheck(context: Context) {
		return context.send(
			{
				message: "OK",
			},
			{
				status: 200,
			},
		);
	}
}
