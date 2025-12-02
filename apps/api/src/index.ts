import { AsenaServerFactory } from "@asenajs/asena";
import { createErgenecoreAdapter } from "@asenajs/ergenecore";
import { logger } from "./lib/logger/logger";

const ergenecoreAdapter = createErgenecoreAdapter({ logger: logger });

const server = await AsenaServerFactory.create({
	adapter: ergenecoreAdapter,
	logger: logger,
	port: getPort(),
});

await server.start();

function getPort() {
	let port = Number.parseInt(process.env["PORT"] ?? "3000", 10);

	if (Number.isNaN(port)) {
		port = 3000;
	}

	return port;
}
