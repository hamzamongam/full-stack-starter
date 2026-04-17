import { implement } from "@orpc/server";
import { prisma } from "@/db";
import { CategoryRepository } from "@/features/category/domain/category.repo";
import { CategoryService } from "@/features/category/domain/category.service";
import {
	toSuccessResponse,
	toSuccessResponseWithPagination,
} from "@/server/orpc/utils";
import { ProductContract } from "./product.contract";
import { ProductRepository } from "./product.repo";
import { ProductService } from "./product.service";

const os = implement(ProductContract).$context();
const productRepository = new ProductRepository(prisma);
const categoryService = new CategoryService(new CategoryRepository(prisma));
const productService = new ProductService(productRepository, categoryService);

export const ProductRouter = os.router({
	create: os.create.handler(async ({ input }) => {
		return toSuccessResponse(await productService.create(input));
	}),
	update: os.update.handler(async ({ input }) => {
		const { id, ...data } = input;
		if (!id) throw new Error("Product ID is required for update");
		return toSuccessResponse(await productService.update(id, data));
	}),
	delete: os.delete.handler(async ({ input }) => {
		return toSuccessResponse(await productService.delete(input));
	}),
	getById: os.getById.handler(async ({ input }) => {
		return toSuccessResponse(await productService.getById(input));
	}),
	getBySlug: os.getBySlug.handler(async ({ input }) => {
		return toSuccessResponse(await productService.getBySlug(input));
	}),
	getAll: os.getAll.handler(async ({ input }) => {
		const { data, meta } = await productService.getAll(input);
		return toSuccessResponseWithPagination(data, meta);
	}),
	getAllCards: os.getAllCards.handler(async ({ input }) => {
		const { data, meta } = await productService.getAllCards(input);
		return toSuccessResponseWithPagination(data, meta);
	}),
	getAllPublic: os.getAllPublic.handler(async ({ input }) => {
		const { data, meta } = await productService.getAllCards({
			...input,
			status: "ACTIVE",
		});
		return toSuccessResponseWithPagination(data, meta);
	}),
});
