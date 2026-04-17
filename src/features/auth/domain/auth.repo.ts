import type { PrismaClient } from "@/generated/prisma/client";

/**
 * AuthRepository manages database interactions related to authentication
 * and user-tenant relationship management.
 */
export class AuthRepository {
	constructor(private readonly prisma: PrismaClient) {}
	/**
	 * Links an existing user to a specific school with a designated role.
	 * Internal method used during onboarding or school joining.
	 * @param userId - ID of the user.
	 * @param schoolId - ID of the school (tenant).
	 * @param role - Access role (e.g., 'school_admin', 'teacher').
	 */

	async isUserExisting(email: string) {
		return await this.prisma.user.findUnique({
			where: { email },
		});
	}
}
