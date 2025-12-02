import { Inject, Middleware } from "@asenajs/asena/server";
import { type Context, MiddlewareService } from "@asenajs/ergenecore";
import { type AuthClient, AuthService } from "@/modules/auth/service";

@Middleware()
export class Authn extends MiddlewareService {
	@Inject(AuthService, (service: AuthService) => service.client)
	private auth: AuthClient;

	async handle(context: Context, next: () => Promise<void>) {
		const session = await this.auth.api.getSession({
			headers: context.headers,
		});

		if (!session?.user) {
			return context.send({ error: "Unauthorized" }, 401);
		}

		context.setValue("session", session);
		await next();
	}
}

export type TSession = NonNullable<
	Awaited<ReturnType<AuthClient["api"]["getSession"]>>
>;
