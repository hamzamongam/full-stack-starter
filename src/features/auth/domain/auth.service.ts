import { auth } from "@/server/auth";
import { BadRequestError } from "@/server/errors";
import { logger } from "@/server/logger";
import { toSuccessResponse } from "@/server/orpc/utils";
import type { AuthRepository } from "./auth.repo";
import type { ChangePasswordInput, TLoginSchema } from "./auth.schema";

/**
 * AuthService handles the core authentication logic for the SaaS platform.
 * It integrates Better-Auth for identity management and handles specialized
 * flows like school registration/onboarding.
 */
export class AuthService {
	constructor(private repo: AuthRepository) {}

	/**
	 * Authenticates a user using email and password.
	 * @param input - The login credentials (email and password).
	 * @returns The session object from Better-Auth.
	 * @throws {UnauthorizedError} if login fails.
	 */
	async login(input: TLoginSchema) {
		logger.info({ email: input.email }, "Login attempt");
		const result = await auth.api.signInEmail({
			body: {
				email: input.email,
				password: input.password,
			},
		});
		logger.info(
			{ email: input.email, userId: result?.user?.id },
			"Login successful",
		);
		return toSuccessResponse(result, "Successfully signed in");
	}

	/**
	 * Step 1: Account Creation (The Identity)
	 * Registers the user and triggers email verification.
	 */
	async signUp(input: { email: string; name: string; password: string }) {
		logger.info({ email: input.email }, "User sign-up attempt");

		const existingUser = await this.repo.isUserExisting(input.email);
		if (existingUser) {
			throw new BadRequestError("User already exists");
		}

		const userCount = await this.repo.countUsers();
		const isFirstUser = userCount === 0;

		const resp = await auth.api.signUpEmail({
			body: {
				email: input.email,
				name: input.name,
				password: input.password,
			},
		});

		if (!resp || !resp.user) {
			throw new BadRequestError("Account creation failed");
		}

		if (isFirstUser) {
			await this.repo.updateUser(resp.user.id, { role: "superAdmin" });
			logger.info({ userId: resp.user.id }, "First user assigned superAdmin role");
		}

		logger.info(
			{ userId: resp.user.id },
			"Account created, verification pending",
		);
		return toSuccessResponse(resp.user, "Account created successfully");
	}

	/**
	 * Step 2: resetPassword (The User)
	 * Resets the password for the verified user.
	 */
	async resetPassword(token: string, newPassword: string) {
		if (!token) {
			throw new BadRequestError("Token is required");
		}

		logger.info({ token, newPassword }, "Resetting password");

		await auth.api.resetPassword({
			body: {
				newPassword,
				token,
			},
		});

		logger.info("Password reset successfully");

		return toSuccessResponse("", "Password reset successfully");
	}

	/**
	 * Step 2: Tenant Profile (The School)
	 * Creates the school profile and links the verified user as Owner.
	 */

	async changePassword(input: ChangePasswordInput) {
		await auth.api.changePassword({
			body: input,
		});

		logger.info("Password changed successfully");

		return toSuccessResponse("", "Password changed successfully");
	}

	async logout(headers: Headers) {
		await auth.api.signOut({
			headers,
		});

		logger.info("User logged out successfully");

		return toSuccessResponse("", "User logged out successfully");
	}
}
