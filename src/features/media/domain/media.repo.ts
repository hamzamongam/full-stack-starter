import type { PrismaClient } from "@/generated/prisma/client";
import type { TCreateMedia, TMediaFilter } from "./media.schema";

export class MediaRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async create(data: TCreateMedia) {
		return this.prisma.media.create({ data });
	}

	async getAll(filter: Partial<TMediaFilter> = {}) {
		const { search, page = 1, limit = 20, type } = filter;

		const where: Record<string, any> = {};
		if (search) {
			where.OR = [
				{ fileName: { contains: search, mode: "insensitive" } },
				{ altText: { contains: search, mode: "insensitive" } },
			];
		}
		if (type) {
			where.type = type;
		}

		const [items, total] = await Promise.all([
			this.prisma.media.findMany({
				where,
				skip: (page - 1) * limit,
				take: limit,
				orderBy: { createdAt: "desc" },
			}),
			this.prisma.media.count({ where }),
		]);

		return { items, total };
	}

	async delete(id: string) {
		return this.prisma.media.delete({
			where: { id },
		});
	}
}
