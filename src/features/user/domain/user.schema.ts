import z from "zod";
import type { Prisma } from "@/generated/prisma/client";

export const UserRoleSchema = z.enum(["user", "admin", "superAdmin"]);

export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	emailVerified: z.boolean().nullable(),
	image: z.string().nullable(),
	role: UserRoleSchema,
	createdAt: z.date(),
	updatedAt: z.date(),
	banned: z.boolean().nullable(),
	banReason: z.string().nullable(),
	banExpires: z.date().nullable(),
});

export type TUserOutput = z.infer<typeof UserSchema>;
export type TUserRole = z.infer<typeof UserRoleSchema>;

export type UserModel = Prisma.UserGetPayload<{}>;
