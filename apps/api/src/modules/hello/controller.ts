import { Controller, Get } from "@asenajs/asena/server";
import type { Context } from "@asenajs/ergenecore";

@Controller({
	path: "/",
})
export class HelloController {
	@Get({
		path: "/",
	})
	async hello(context: Context) {
		return context.send(
			{
				message: "Hello World!",
			},
			{
				status: 200,
			},
		);
	}
}
