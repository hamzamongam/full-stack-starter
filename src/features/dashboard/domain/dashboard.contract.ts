import { oc } from "@orpc/contract";
import z from "zod";

export const DashboardStatsSchema = z.object({
	totalProducts: z.number(),
	totalCategories: z.number(),
	totalUsers: z.number(),
	activeSessions: z.number(),
	revenue: z.number(),
	ordersCount: z.number(),
});

export const SalesTrendSchema = z.object({
	date: z.string(),
	sales: z.number(),
	orders: z.number(),
});

export const DashboardContract = oc.router({
	getOverviewStats: oc.output(DashboardStatsSchema),
	getSalesTrend: oc.output(z.array(SalesTrendSchema)),
});
