import type { PrismaClient, UserRole } from "@/generated/prisma/client";

/**
 * AuthRepository manages database interactions related to authentication
 * and user-tenant relationship management.
 */
export class AuthRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async isUserExisting(email: string) {
		return await this.prisma.user.findUnique({
			where: { email },
		});
	}

	async countUsers() {
		return await this.prisma.user.count();
	}

	async updateUser(id: string, data: Partial<{ role: UserRole }>) {
		return await this.prisma.user.update({
			where: { id },
			data,
		});
	}
}
