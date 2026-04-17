import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, customSession } from "better-auth/plugins";
import { prisma } from "@/db";
// import { sendInvitationEmail, sendResetPasswordEmail } from "@/lib/mail";
import { ac, roles } from "./permissions";
import { tanstackStartCookie } from "./plugin/tanstack-start-cookies";

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,

		async sendResetPassword({ user, url, token }) {
			// Construct custom invite URL
			const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
			const inviteUrl = `${baseUrl}/invite/accept?token=${token}`;

			if (!user.emailVerified) {
				// New user flow (Invitation)
				// await sendInvitationEmail(user.email, inviteUrl, user.name);
			} else {
				// Existing user flow (Password Reset)
				// We can reuse the same page but maybe the email content differs
				// await sendResetPasswordEmail(user.email, inviteUrl, user.name);
			}
		},

		/**
		 * Hook triggered after password is successfully reset.
		 * We use this to verify the email address for new users who just set their password.
		 */
		// async onPasswordReset({ user }) {
		// 	if (!user.emailVerified) {
		// 		await prisma.user.update({
		// 			where: { id: user.id },
		// 			data: { emailVerified: true },
		// 		});
		// 	}
		// },
	},
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	plugins: [
		admin({
			ac,
			roles,
			// adminRoles: ["schoolAdmin", "superAdmin"],

			// defaultRole: 'admin'
			// roles: {
			//   sadmin: ''
			// }
		}),
		tanstackStartCookie(),
		// customSession(async ({ user, session }) => {
		// 	const dbUser = await prisma.user.findUnique({
		// 		where: {
		// 			id: user.id,
		// 		},
		// 		select: {
		// 			schoolId: true,
		// 			role: true,
		// 			school: { select: { onboardingStatus: true } },
		// 		},
		// 	});
		// 	return {
		// 		user: {
		// 			...user,
		// 			onboardingStatus: dbUser?.school?.onboardingStatus ?? "PENDING",
		// 			role: dbUser?.role as UserRole,
		// 			schoolId: dbUser?.schoolId,
		// 		},
		// 		session,
		// 	};
		// }),
		// emailPassword(),
	],
	user: {
		additionalFields: {
			// schoolId: {
			// 	type: "string",
			// 	required: false,
			// },
			role: {
				type: ["user", "admin", "superAdmin"],
				required: false,
			},
		},
	},
});
