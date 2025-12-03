import path from "node:path";
import { StaticServe } from "@asenajs/asena/server";
import { type Context, StaticServeService } from "@asenajs/ergenecore";

@StaticServe({ root: path.join(process.cwd(), "uploads") })
export class StaticServeMiddleware extends StaticServeService {
	public rewriteRequestPath(reqPath: string): string {
		// Remove /uploads prefix from path
		return reqPath.replace(/^\/uploads\/|^\/uploads/, "");
	}

	public onFound(filePath: string, _c: Context): void {
		console.log(`File served: ${filePath}`);
	}

	public onNotFound(reqPath: string, _c: Context): void {
		console.log(`File not found: ${reqPath}`);
	}
}
