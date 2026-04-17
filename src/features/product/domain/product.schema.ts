import z from "zod";
import { MediaInputSchema } from "@/features/media/domain/media.schema";

export const ProductOptionValueSchema = z.object({
	id: z.string().optional(),
	optionId: z.string().optional(),
	value: z.string().min(1, "Value is required"),
	position: z.number().int().default(0),
});

export const ProductOptionSchema = z.object({
	id: z.string().optional(),
	productId: z.string().optional(),
	name: z.string().min(1, "Option name is required"),
	position: z.number().int().default(0),
	values: z.array(ProductOptionValueSchema).default([]),
});

export const ProductVariantImageSchema = z.object({
	id: z.string(),
	variantId: z.string(),
	imageId: z.string(),
	position: z.number().int().default(0),
	image: MediaInputSchema.optional(),
});

export const ProductVariantSchema = z.object({
	id: z.string().optional(),
	productId: z.string().optional(),
	title: z.string().min(1, "Title is required"),
	price: z.coerce.number().min(0, "Price must be positive"),
	compareAtPrice: z.coerce.number().nullable().optional(),
	costPerItem: z.coerce.number().nullable().optional(),
	sku: z.string().nullable().optional(),
	barcode: z.string().nullable().optional(),
	media: z.array(MediaInputSchema).optional(), // UI transient field for preview (multiple images)
	images: z.array(ProductVariantImageSchema).optional(), // Relation
	trackInventory: z.boolean().default(true),
	quantity: z.coerce.number().int().min(0).default(0),
	options: z.record(z.string(), z.string()).optional(),
});

export const ProductSchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Name is required"),
	slug: z.string().optional(),
	description: z.string().min(1, "Description is required"),
	shortDescription: z.string().optional().nullable(),
	price: z.coerce.number().min(0, "Price must be positive"),
	compareAtPrice: z.coerce.number().nullable().optional(),
	offerPrice: z.coerce.number().nullable().optional(),
	costPerItem: z.coerce.number().nullable().optional(),
	sku: z.string().min(1, "SKU is required"),
	barcode: z.string().min(1, "Barcode is required"),
	trackInventory: z.boolean().default(true),
	quantity: z.coerce.number().int().min(0).default(0),
	status: z
		.preprocess(
			(val) => val ?? "DRAFT",
			z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
		)
		.default("DRAFT"),
	isFeatured: z.boolean().default(false),
	images: z.array(MediaInputSchema).optional(),
	categoryId: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	options: z.array(ProductOptionSchema).optional(),
	variants: z.array(ProductVariantSchema).optional(),
});

export const ProductCardSchema = ProductSchema.pick({
	id: true,
	name: true,
	slug: true,
	price: true,
	compareAtPrice: true,
	status: true,
	isFeatured: true,
	categoryId: true,
	trackInventory: true,
	quantity: true,
}).extend({
	image: MediaInputSchema.optional().nullable(),
	images: z.array(MediaInputSchema).optional().nullable(),
});

export type ProductModel = TProduct;

export type TProductOptionValue = z.infer<typeof ProductOptionValueSchema>;
export type TProductOption = z.infer<typeof ProductOptionSchema>;
export type TProductVariant = z.infer<typeof ProductVariantSchema>;

export const CreateProductSchema = ProductSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const UpdateProductSchema = ProductSchema.partial().omit({
	createdAt: true,
	updatedAt: true,
});

export const ProductFilterSchema = z.object({
	search: z.string().optional(),
	categoryIds: z.array(z.string()).optional(),
	minPrice: z.number().optional(),
	maxPrice: z.number().optional(),
	status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
	isFeatured: z.boolean().optional(),
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(12),
});

export type TProduct = z.infer<typeof ProductSchema>;
export type TProductCard = z.infer<typeof ProductCardSchema>;
export type TCreateProduct = z.infer<typeof CreateProductSchema>;
export type TUpdateProduct = z.infer<typeof UpdateProductSchema>;
export type TProductFilter = z.infer<typeof ProductFilterSchema>;
// export type TProductListResponse = z.infer<typeof ProductListResponseSchema>;
