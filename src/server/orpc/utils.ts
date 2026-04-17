import { ORPCError } from "@orpc/server";
import { PrismaClientValidationError } from "@prisma/client/runtime/client";
import { APIError } from "better-auth";
import { ZodError, z } from "zod";
import { AppError } from "../errors";
import { logger } from "../logger";

/**
 * Standard API response structure for all successful operations.
 */
export const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		success: z.literal(true),
		message: z.string().optional(),
		data: dataSchema,
	});
export const SuccessResponseWithPaginationSchema = <T extends z.ZodTypeAny>(
	dataSchema: T,
) =>
	z.object({
		success: z.literal(true),
		message: z.string().optional(),
		data: dataSchema,
		meta: z.object({
			total: z.number(),
			page: z.number(),
			totalPages: z.number(),
		}),
	});

export type SuccessResponse<T> = {
	success: true;
	message?: string;
	data: T;
};

export type TPaginationMeta = {
	total: number;
	page: number;
	totalPages: number;
};

export type SuccessResponseWithPagination<T> = {
	success: true;
	message?: string;
	data: T;
	meta: TPaginationMeta;
};

/**
 * onGlobalError is a global error mapping interceptor.
 * It catches domain-level AppErrors and maps them to ORPCErrors.
 *
 * We use an explicit interceptor pattern here to ensure compatibility
 * with both OpenAPIHandler and RPCHandler types.
 */
// biome-ignore lint/suspicious/noExplicitAny: interceptor returns unknown result
export const onGlobalError = async ({ next }: { next: () => Promise<any> }) => {
	try {
		return await next();
	} catch (error) {
		if (error instanceof APIError) {
			logger.warn(
				{
					errors: error.message,
					statusCode: error.statusCode,
					status: error.status,
				},
				"Btter Auth  error occurred",
			);
			throw new ORPCError(error.status as any, {
				defined: true,
				message: error.message,
				status: error.statusCode,
			});
		}

		if (error instanceof AppError) {
			logger.warn(
				{
					error: error.code,
					message: error.message,
					details: error.details,
				},
				"Application error occurred AppError",
			);
			throw new ORPCError(error.code, {
				defined: true,
				message: error.message,
				data: error.details,
			});
		}
		if (error instanceof PrismaClientValidationError) {
			logger.warn(
				{
					error: error.name,
					message: error.message,
					details: error.message,
				},
				"Prisma validation error occurred - Prisma",
			);
			throw new ORPCError("BAD_REQUEST", {
				defined: true,
				message: error.message,
				data: error.stack,
			});
		}

		if (error instanceof ZodError) {
			logger.warn(
				{
					errors: error.flatten().fieldErrors,
				},
				"Validation error occurred",
			);
			throw new ORPCError("BAD_REQUEST", {
				defined: true,
				message: "Validation failed",
				data: error.flatten().fieldErrors,
			});
		}

		// Log unexpected errors
		logger.error({ error }, "Unexpected error occurred");
		throw error;
	}
};

/**
 * Helper to wrap data into a standardized successful API response.
 */
export function toSuccessResponse<T>(
	data: T,
	message = "Action completed successfully",
): SuccessResponse<T> {
	return {
		success: true,
		message,
		data,
	};
}

export function toSuccessResponseWithPagination<T>(
	data: T,
	meta: {
		total: number;
		page: number;
		totalPages: number;
	},
	message = "Action completed successfully",
): SuccessResponseWithPagination<T> {
	return {
		success: true,
		meta,
		message,
		data,
	};
}
