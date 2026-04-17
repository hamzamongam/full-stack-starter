import type { Prisma, PrismaClient } from "@/generated/prisma/client";

export class ProductRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async create(data: Prisma.ProductCreateInput) {
		return this.prisma.product.create({
			data,
			include: {
				images: {
					orderBy: { position: "asc" },
				},
				variants: true,
			},
		});
	}

	async update(id: string, data: Prisma.ProductUpdateInput) {
		return this.prisma.product.update({
			where: { id },
			data,
			include: {
				images: {
					orderBy: { position: "asc" },
				},
				variants: true,
			},
		});
	}

	async delete(id: string) {
		return this.prisma.product.delete({
			where: {
				id,
			},
			include: {
				images: {
					orderBy: { position: "asc" },
				},
				variants: true,
			},
		});
	}

	async getById(id: string) {
		return this.prisma.product.findUnique({
			where: { id },
			include: {
				images: {
					orderBy: { position: "asc" },
				},
				variants: true,
			},
		});
	}

	async getAll(args: {
		where?: Prisma.ProductWhereInput;
		skip?: number;
		take?: number;
		orderBy?: Prisma.ProductOrderByWithRelationInput;
	}) {
		const [items, total] = await Promise.all([
			this.prisma.product.findMany({
				where: args.where,
				skip: args.skip,
				take: args.take,
				orderBy: args.orderBy ?? { createdAt: "desc" },
				include: {
					category: true,
					images: {
						orderBy: { position: "asc" },
					},
					variants: true,
				},
			}),
			this.prisma.product.count({ where: args.where }),
		]);

		return { items, total };
	}

	async getBySlug(slug: string) {
		return this.prisma.product.findUnique({
			where: { slug },
			include: {
				options: {
					include: {
						values: true,
					},
				},
				variants: {
					include: {
						images: {
							include: { image: true },
							orderBy: { position: "asc" },
						},
					},
				},
				category: true,
				images: {
					orderBy: { position: "asc" },
				},
			},
		});
	}

	async decrementInventory(productId: string, variantId: string | null, quantity: number) {
		if (variantId) {
			return this.prisma.productVariant.update({
				where: { id: variantId },
				data: {
					quantity: {
						decrement: quantity
					}
				}
			});
		} else {
			return this.prisma.product.update({
				where: { id: productId },
				data: {
					quantity: {
						decrement: quantity
					}
				}
			});
		}
	}
}
