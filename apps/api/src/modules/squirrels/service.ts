import { Service } from "@asenajs/asena/server";

@Service({
	name: "SquirrelsService",
})
export class SquirrelsService {
	async list() {}

	async get(id: string) {}

	async create(data: any) {}

	async update(id: string, data: any) {}

	async delete(id: string) {}
}
