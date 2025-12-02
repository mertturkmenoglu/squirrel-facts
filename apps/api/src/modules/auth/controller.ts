import { Controller, Get, Inject, Post } from "@asenajs/asena/server";
import type { Context } from "@asenajs/ergenecore";
import { AuthService } from "./service";

@Controller({
	path: "/api/auth",
})
export class AuthController {
	@Inject(AuthService)
	private service: AuthService;

	@Get("/*")
	async get(context: Context) {
		return this.service.client.handler(context.req);
	}

	@Post("/*")
	async post(context: Context) {
		return this.service.client.handler(context.req);
	}
}
