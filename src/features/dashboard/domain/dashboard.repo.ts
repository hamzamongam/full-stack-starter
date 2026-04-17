import type { PrismaClient } from "@/generated/prisma/client";

export class DashboardRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async getOverviewStats() {
		const [productsCount, categoriesCount, usersCount, sessionsCount] =
			await Promise.all([
				this.prisma.product.count(),
				this.prisma.category.count(),
				this.prisma.user.count(),
				this.prisma.session.count(),
			]);

		return {
			totalProducts: productsCount,
			totalCategories: categoriesCount,
			totalUsers: usersCount,
			activeSessions: sessionsCount,
			revenue: 145230, // Simulated
			ordersCount: 1240, // Simulated
		};
	}

	async getSalesTrend() {
		// Simulated 7-day trend
		return [
			{ date: "Mon", sales: 4000, orders: 24 },
			{ date: "Tue", sales: 3000, orders: 13 },
			{ date: "Wed", sales: 2000, orders: 98 },
			{ date: "Thu", sales: 2780, orders: 39 },
			{ date: "Fri", sales: 1890, orders: 48 },
			{ date: "Sat", sales: 2390, orders: 38 },
			{ date: "Sun", sales: 3490, orders: 43 },
		];
	}
}
