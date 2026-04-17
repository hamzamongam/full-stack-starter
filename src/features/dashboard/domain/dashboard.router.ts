import { implement } from "@orpc/server";
import { DashboardContract } from "./dashboard.contract";
import { DashboardService } from "./dashboard.service";

const os = implement(DashboardContract).$context();

export const DashboardRouter = os.router({
	getOverviewStats: os.getOverviewStats.handler(async () => {
		return await DashboardService.getOverviewStats();
	}),
	getSalesTrend: os.getSalesTrend.handler(async () => {
		return await DashboardService.getSalesTrend();
	}),
});
