import type { PrismaClient } from "@/generated/prisma/client";

export class UserRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async findAll(input: { page: number; limit: number }) {
		const { page, limit } = input;
		const skip = (page - 1) * limit;

		const [data, total] = await Promise.all([
			this.prisma.user.findMany({
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
			}),
			this.prisma.user.count(),
		]);

		return { data, total };
	}
}
