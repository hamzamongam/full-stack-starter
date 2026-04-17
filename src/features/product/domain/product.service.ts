import type { CategoryService } from "@/features/category/domain/category.service";
import { NotFoundError } from "@/server/errors";
import type { ProductRepository } from "./product.repo";
import {
	ProductCardSchema,
	type TCreateProduct,
	type TProduct,
	type TProductCard,
	type TProductFilter,
	type TProductOption,
	type TProductVariant,
	type TUpdateProduct,
} from "./product.schema";
import type { TMediaInput } from "@/features/media/domain/media.schema";
import type { Prisma } from "@/generated/prisma/client";

export class ProductService {
	constructor(
		private readonly productRepository: ProductRepository,
		private readonly categoryService: CategoryService,
	) {}

	private async generateUniqueSlug(baseSlug: string) {
		let slug = baseSlug;
		let count = 1;
		while (await this.productRepository.getBySlug(slug)) {
			slug = `${baseSlug}-${count}`;
			count++;
		}
		return slug;
	}

	async create(data: TCreateProduct) {
		await this.categoryService.isCategoryExists(data.categoryId);

		let slug = data.slug;
		if (!slug) {
			const baseSlug = data.name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)+/g, "");
			slug = await this.generateUniqueSlug(baseSlug || "product");
		} else {
			const existing = await this.productRepository.getBySlug(slug);
			if (existing) throw new Error("Slug already exists");
		}

		const { options, variants, images, ...productData } = data;

		const result = await this.productRepository.create({
			...productData,
			slug: slug,
			category: { connect: { id: data.categoryId } },
			images: this.mapImages(images),
			options: this.mapOptions(options),
			variants: this.mapVariants(variants),
		});
		return this.formatToOutput(result);
	}

	async isExist(id: string) {
		const result = await this.productRepository.getById(id);
		if (!result) throw new NotFoundError("Product not found");
		return result;
	}

	async update(id: string, data: TUpdateProduct) {
		const isExist = await this.isExist(id);
		if (!isExist) throw new NotFoundError("Product not found");

		if (data.slug) {
			const existing = await this.productRepository.getBySlug(data.slug);
			if (existing && existing.id !== id) {
				throw new Error("Slug already exists");
			}
		}

		const { options, variants, images, categoryId, ...updateData } = data;

		const result = await this.productRepository.update(id, {
			...updateData,
			...(categoryId && { category: { connect: { id: categoryId } } }),
			...(images && {
				images: {
					set: [], // Disconnect existing
					connect: images.map((item) => ({ id: item.id })),
				},
			}),
			...(options && {
				options: {
					deleteMany: {},
					...this.mapOptions(options),
				},
			}),
			...(variants && {
				variants: {
					deleteMany: {},
					...this.mapVariants(variants),
				},
			}),
		});
		return this.formatToOutput(result);
	}

	async delete(id: string) {
		const isExist = await this.isExist(id);
		if (!isExist) throw new NotFoundError("Product not found");
		const result = await this.productRepository.delete(id);
		return this.formatToOutput(result);
	}

	async getById(id: string) {
		const result = await this.productRepository.getById(id);
		if (!result) throw new NotFoundError("Product not found");
		return this.formatToOutput(result);
	}

	async getBySlug(slug: string) {
		const result = await this.productRepository.getBySlug(slug);
		if (!result) throw new NotFoundError("Product not found");
		return this.formatToOutput(result);
	}

	async getAll(filter: Partial<TProductFilter> = {}) {
		const { page = 1, limit = 12 } = filter;
		const where = this.buildWhereClause(filter);

		const { items, total } = await this.productRepository.getAll({
			where,
			skip: (page - 1) * limit,
			take: limit,
		});

		const totalPages = Math.ceil(total / limit);

		return {
			data: items.map((item) => this.formatToOutput(item)),
			meta: {
				total,
				page,
				totalPages,
			},
		};
	}

	async getAllCards(filter: Partial<TProductFilter> = {}) {
		const { page = 1, limit = 12 } = filter;
		const where = this.buildWhereClause(filter);

		const { items, total } = await this.productRepository.getAll({
			where,
			skip: (page - 1) * limit,
			take: limit,
		});

		const totalPages = Math.ceil(total / limit);

		return {
			data: items.map((item) => this.formatToCard(item)),
			meta: {
				total,
				page,
				totalPages,
			},
		};
	}

	private formatToCard(
		product: Prisma.ProductGetPayload<{
			include: { images: true; variants: true };
		}>,
	): TProductCard {
		const images = product.images || [];
		const mainImage = images.length > 0 ? images[0] : null;

		// Calculate total quantity if variants exist
		let totalQuantity = Number(product.quantity || 0);
		if (product.variants && product.variants.length > 0) {
			totalQuantity = product.variants.reduce(
				(sum: number, variant: any) => sum + Number(variant.quantity || 0),
				0,
			);
		}

		return ProductCardSchema.parse({
			id: product.id,
			name: product.name,
			slug: product.slug,
			price: Number(product.price),
			compareAtPrice: product.compareAtPrice
				? Number(product.compareAtPrice)
				: null,
			status: product.status,
			isFeatured: product.isFeatured,
			image: mainImage,
			categoryId: product.categoryId,
			trackInventory: !!(product.trackInventory ?? true),
			quantity: totalQuantity,
		});
	}

	private formatToOutput(
		product: Prisma.ProductGetPayload<{
			include: { images: true; variants: true };
		}>,
	): TProduct {
		// Calculate total quantity if variants exist
		let totalQuantity = Number(product.quantity || 0);
		if (product.variants && product.variants.length > 0) {
			totalQuantity = product.variants.reduce(
				(sum: number, variant: any) => sum + Number(variant.quantity || 0),
				0,
			);
		}

		return {
			...product,
			price: Number(product.price),
			compareAtPrice: product.compareAtPrice
				? Number(product.compareAtPrice)
				: null,
			offerPrice: product.offerPrice ? Number(product.offerPrice) : null,
			costPerItem: product.costPerItem ? Number(product.costPerItem) : null,
			images: (product.images as any) || [],
			status: product.status,
			slug: product.slug || "",
			categoryId: product.categoryId || "",
			trackInventory: !!(product.trackInventory ?? true),
			quantity: totalQuantity,
			createdAt: product.createdAt || new Date(),
			updatedAt: product.updatedAt || new Date(),
			variants: Array.isArray(product.variants)
				? product.variants.map((v: any) => ({
						...v,
						price: Number(v.price),
						compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
						costPerItem: v.costPerItem ? Number(v.costPerItem) : null,
						trackInventory: !!(v.trackInventory ?? true),
						quantity: Number(v.quantity || 0),
						images: v.images || [],
					}))
				: undefined,
		} as TProduct;
	}

	private buildWhereClause(filter: Partial<TProductFilter>): Prisma.ProductWhereInput {
		const { search, categoryIds, minPrice, maxPrice, status, isFeatured } = filter;
		const where: Prisma.ProductWhereInput = {};

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
			];
		}

		if (categoryIds && categoryIds.length > 0) {
			where.categoryId = { in: categoryIds };
		}

		if (minPrice !== undefined || maxPrice !== undefined) {
			where.price = {
				gte: minPrice,
				lte: maxPrice,
			};
		}

		if (status) {
			where.status = status;
		}

		if (isFeatured !== undefined) {
			where.isFeatured = isFeatured;
		}

		return where;
	}

	private mapImages(media?: TMediaInput[]) {
		if (!media || media.length === 0) return undefined;
		return {
			connect: media.map((item) => ({ id: item.id })),
		};
	}

	private mapOptions(options?: TProductOption[]) {
		if (!options || options.length === 0) return undefined;
		return {
			create: options.map((opt) => ({
				name: opt.name,
				position: opt.position,
				values: {
					create: opt.values.map((val) => ({
						value: val.value,
						position: val.position,
					})),
				},
			})),
		};
	}

	private mapVariants(variants?: TProductVariant[]) {
		if (!variants || variants.length === 0) return undefined;
		return {
			create: variants.map((variant) => ({
				title: variant.title,
				price: variant.price,
				compareAtPrice: variant.compareAtPrice,
				costPerItem: variant.costPerItem,
				sku: variant.sku,
				barcode: variant.barcode,
				trackInventory: variant.trackInventory,
				quantity: variant.quantity,
				options: variant.options ?? {},
				images: {
					create: variant.media?.map((m, index) => ({
						image: { connect: { id: m.id } },
						position: index,
					})),
				},
			})),
		};
	}
}
