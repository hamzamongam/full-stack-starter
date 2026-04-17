import { DashboardContract } from "./dashboard.contract";
import { DashboardRepository } from "./dashboard.repo";

import { prisma } from "@/db";

const repo = new DashboardRepository(prisma);

export const DashboardService = {
	getOverviewStats: async () => {
		return await repo.getOverviewStats();
	},
	getSalesTrend: async () => {
		return await repo.getSalesTrend();
	},
};
