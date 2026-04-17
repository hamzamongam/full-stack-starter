import z from "zod";

export const loginSchema = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const SignUpSchema = z.object({
	email: z.string().email("Please provide a valid email"),
	name: z.string().min(2, "Name is required"),
	password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const CreateSchoolProfileSchema = z.object({
	schoolName: z.string().min(3, "School name is required"),
	logo: z.string().optional(),
	address: z.string().optional(),
	website: z.string().url("Invalid website URL").optional().or(z.literal("")),
});

export const UserSchema = z.object({
	id: z.string(),
	email: z.email(),
	name: z.string(),
	role: z.enum(["user", "admin", "superAdmin"]),
});

export const AuthSessionSchema = z.object({
	user: UserSchema,
	session: z.object({
		id: z.string(),
		expiresAt: z.date(),
		createdAt: z.date(),
	}),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type CreateSchoolProfileInput = z.infer<
	typeof CreateSchoolProfileSchema
>;
export type AuthSession = z.infer<typeof AuthSessionSchema>;

export const ChangePasswordSchema = z.object({
	currentPassword: z.string().min(1, "Current password is required"),
	newPassword: z.string().min(8, "Password must be at least 8 characters long"),
	revokeOtherSessions: z.boolean().optional(),
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
