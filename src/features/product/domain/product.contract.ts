import { oc } from "@orpc/contract";
import z from "zod";
import {
	SuccessResponseSchema,
	SuccessResponseWithPaginationSchema,
} from "@/server/orpc/utils";
import {
	CreateProductSchema,
	ProductFilterSchema,
	ProductSchema,
	ProductCardSchema,
	UpdateProductSchema,
} from "./product.schema";

export const ProductContract = oc.router({
	create: oc
		.input(CreateProductSchema)
		.output(SuccessResponseSchema(ProductSchema)),
	update: oc
		.input(UpdateProductSchema.extend({ id: z.string() }))
		.output(SuccessResponseSchema(ProductSchema)),
	delete: oc.input(z.string()).output(SuccessResponseSchema(ProductSchema)),
	getById: oc.input(z.string()).output(SuccessResponseSchema(ProductSchema)),
	getBySlug: oc.input(z.string()).output(SuccessResponseSchema(ProductSchema)),
	getAll: oc
		.input(ProductFilterSchema)
		.output(SuccessResponseWithPaginationSchema(z.array(ProductSchema))),
	getAllCards: oc
		.input(ProductFilterSchema)
		.output(SuccessResponseWithPaginationSchema(z.array(ProductCardSchema))),
	getAllPublic: oc
		.input(ProductFilterSchema)
		.output(SuccessResponseWithPaginationSchema(z.array(ProductCardSchema))),
});
