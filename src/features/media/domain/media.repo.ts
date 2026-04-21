import { type Prisma, type PrismaClient } from "@/generated/prisma/client";
import type { TCreateMedia, TMediaFilter } from "./media.schema";

export class MediaRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async create(data: TCreateMedia) {
		return this.prisma.media.create({ data });
	}

	async getAll(filter: Partial<TMediaFilter> = {}) {
		const {
			search,
			page = 1,
			limit = 20,
			type,
			orderBy = { createdAt: "desc" },
		} = filter;

		const where: Prisma.MediaWhereInput = {};
		if (search) {
			where.OR = [
				{ fileName: { contains: search, mode: "insensitive" } },
				{ altText: { contains: search, mode: "insensitive" } },
			];
		}
		if (type) {
			where.type = type;
		}

		const [items, total] = await this.prisma.$transaction([
			this.prisma.media.findMany({
				where,
				skip: (page - 1) * limit,
				take: limit,
				orderBy,
				select: {
					id: true,
					url: true,
					fileName: true,
					type: true,
					altText: true,
					imageKey: true,
					mimeType: true,
					size: true,
					createdAt: true,
					updatedAt: true,
				},
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
