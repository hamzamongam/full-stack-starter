import z from "zod";

export const MediaTypeEnum = z.enum(["banner", "others"]);

export const MediaSchema = z.object({
	id: z.string(),
	imageKey: z.string(),
	type: MediaTypeEnum.optional().nullable(),
	url: z.string(),
	fileName: z.string(),
	mimeType: z.string(),
	size: z.number(),
	altText: z.string().nullable().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const MediaFilterSchema = z.object({
	type: MediaTypeEnum.optional().nullable(),
	search: z.string().optional(),
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(20),
});

export const MediaInputSchema = z.object({
	id: z.string().optional(),
	url: z.string().optional(),
});

export type TMedia = z.infer<typeof MediaSchema>;
export type TMediaFilter = z.infer<typeof MediaFilterSchema>;

export const CreateMediaSchema = MediaSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export type TCreateMedia = z.infer<typeof CreateMediaSchema>;
export type TMediaInput = z.infer<typeof MediaInputSchema>;
export type TMediaType = z.infer<typeof MediaTypeEnum>;
