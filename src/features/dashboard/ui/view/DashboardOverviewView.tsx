import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
	Activity,
	ArrowUpRight,
	Package,
	Plus,
	ShoppingCart,
	TrendingUp,
	Users,
} from "lucide-react";
import { type FC, useId } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { BaseButton } from "@/components/base/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { orpc } from "@/server/orpc/client";

const StatCard: FC<{
	title: string;
	value: string | number;
	description: string;
	icon: any;
	trend?: { value: string; positive: boolean };
	color: string;
	className?: string;
}> = ({ title, value, description, icon: Icon, trend, color, className }) => (
	<Card
		className={cn(
			"overflow-hidden border-none glass hover-scale group relative animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none focus-within:ring-2 ring-primary/20",
			className,
		)}
	>
		<div
			className={cn(
				"absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity",
				color === "primary" ? "bg-primary" : `bg-${color}`,
			)}
		/>
		<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-primary">
			<CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
				{title}
			</CardTitle>
			<div
				className={cn(
					"p-2 rounded-xl transition-transform group-hover:scale-110",
					color === "primary"
						? "bg-primary/10 text-primary"
						: `bg-${color}/10 text-${color}`,
				)}
			>
				<Icon className="size-5" />
			</div>
		</CardHeader>
		<CardContent>
			<div className="text-3xl font-black tracking-tighter mb-1 font-mono">
				{value}
			</div>
			<div className="flex items-center gap-2">
				{trend && (
					<Badge
						variant={trend.positive ? "success" : "destructive"}
						className="rounded-lg px-1.5 py-0 h-5 font-bold"
					>
						{trend.positive ? (
							<ArrowUpRight className="size-3 mr-0.5" />
						) : (
							<ArrowUpRight className="size-3 mr-0.5 rotate-90" />
						)}
						{trend.value}
					</Badge>
				)}
				<p className="text-xs font-medium text-muted-foreground">
					{description}
				</p>
			</div>
		</CardContent>
	</Card>
);

const DashboardOverviewView: FC = () => {
	const gradientId = useId();
	const { data: stats } = useQuery(
		orpc.dashboard.getOverviewStats.queryOptions(),
	);

	const { data: trend } = useQuery(orpc.dashboard.getSalesTrend.queryOptions());

	const { data: recentProducts } = useQuery(
		orpc.product.getAll.queryOptions({
			input: { page: 1, limit: 5 },
		}),
	);

	const formatCurrency = (val: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(val);

	return (
		<div className="space-y-8 pb-10">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
				<div>
					<h1 className="text-4xl font-black tracking-tighter text-gradient mb-2">
						Dashboard Overview
					</h1>
					<p className="text-muted-foreground font-medium">
						Welcome back! Here's what's happening with your store today.
					</p>
				</div>
				<div className="flex items-center gap-3">
					<BaseButton
						variant="primaryOutline"
						className="rounded-xl font-bold border-2"
						leftIcon={<Activity className="size-4" />}
					>
						Real-time Feed
					</BaseButton>
					<BaseButton
						className="rounded-xl font-bold shadow-lg shadow-primary/25"
						leftIcon={<Plus className="size-4" />}
						render={<Link to="/admin/products/add" />}
					>
						Create Product
					</BaseButton>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Revenue"
					value={formatCurrency(stats?.revenue || 0)}
					description="+12.5% from last month"
					icon={TrendingUp}
					trend={{ value: "12%", positive: true }}
					color="primary"
					className="animation-delay-100"
				/>
				<StatCard
					title="Total Orders"
					value={stats?.ordersCount || 0}
					description="+8% from last week"
					icon={ShoppingCart}
					trend={{ value: "8%", positive: true }}
					color="blue-500"
					className="animation-delay-200"
				/>
				<StatCard
					title="Inventory"
					value={stats?.totalProducts || 0}
					description="Across categories"
					icon={Package}
					color="emerald-500"
					className="animation-delay-300"
				/>
				<StatCard
					title="Active Users"
					value={stats?.totalUsers || 0}
					description="Currently online: 14"
					icon={Users}
					trend={{ value: "2%", positive: true }}
					color="amber-500"
					className="animation-delay-400"
				/>
			</div>

			{/* Main Content Grid */}
			<div className="grid gap-6 lg:grid-cols-7">
				{/* Sales Chart */}
				<Card className="lg:col-span-4 border-none glass overflow-hidden animate-in fade-in zoom-in-95 duration-1000 delay-500">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-xl font-bold tracking-tight text-foreground">
									Sales Analytics
								</CardTitle>
								<CardDescription className="font-medium text-muted-foreground">
									Daily revenue trend for the past week
								</CardDescription>
							</div>
							<Badge
								variant="outline"
								className="rounded-lg border-2 font-bold px-3"
							>
								Last 7 Days
							</Badge>
						</div>
					</CardHeader>
					<CardContent className="pl-2">
						<div className="h-[350px] w-full">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={trend || []}>
									<defs>
										<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
											<stop
												offset="5%"
												stopColor="hsl(var(--primary))"
												stopOpacity={0.3}
											/>
											<stop
												offset="95%"
												stopColor="hsl(var(--primary))"
												stopOpacity={0}
											/>
										</linearGradient>
									</defs>
									<CartesianGrid
										strokeDasharray="3 3"
										vertical={false}
										stroke="hsl(var(--muted-foreground)/0.1)"
									/>
									<XAxis
										dataKey="date"
										axisLine={false}
										tickLine={false}
										tick={{
											fill: "hsl(var(--muted-foreground))",
											fontSize: 12,
											fontWeight: 600,
										}}
										dy={10}
									/>
									<YAxis
										axisLine={false}
										tickLine={false}
										tick={{
											fill: "hsl(var(--muted-foreground))",
											fontSize: 12,
											fontWeight: 600,
										}}
										tickFormatter={(value) => `$${value / 1000}k`}
									/>
									<Tooltip
										content={({ active, payload }) => {
											if (active && payload && payload.length) {
												return (
													<div className="glass p-4 rounded-2xl border-2 shadow-2xl animate-in zoom-in-95 duration-200">
														<p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
															{payload[0].payload.date}
														</p>
														<p className="text-xl font-black text-primary">
															{formatCurrency(payload[0].value as number)}
														</p>
														<p className="text-[10px] font-bold text-muted-foreground">
															{payload[0].payload.orders} Successful Orders
														</p>
													</div>
												);
											}
											return null;
										}}
									/>
									<Area
										type="monotone"
										dataKey="sales"
										stroke="hsl(var(--primary))"
										strokeWidth={4}
										fillOpacity={1}
										fill={`url(#${gradientId})`}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				{/* Recent Products */}
				<Card className="lg:col-span-3 border-none glass overflow-hidden flex flex-col animate-in fade-in slide-in-from-right-4 duration-1000 delay-700">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-xl font-bold tracking-tight text-foreground">
									Recently Added
								</CardTitle>
								<CardDescription className="font-medium text-muted-foreground">
									Latest items in your inventory
								</CardDescription>
							</div>
							<Link
								to="/admin/products"
								className="text-xs font-black uppercase tracking-widest text-primary hover:underline"
							>
								View All
							</Link>
						</div>
					</CardHeader>
					<CardContent className="flex-1 px-0">
						<div className="space-y-1">
							{recentProducts?.data?.map((product) => (
								<div
									key={product.id}
									className="flex items-center gap-4 px-6 py-3 hover:bg-primary/5 transition-colors cursor-pointer group"
								>
									<div className="size-12 rounded-xl bg-muted overflow-hidden border-2 border-transparent group-hover:border-primary/20 transition-all shrink-0">
										{product.images?.[0]?.url ? (
											<img
												src={product.images[0].url}
												alt={product.name}
												className="size-full object-cover"
											/>
										) : (
											<div className="size-full flex items-center justify-center bg-primary/5">
												<Package className="size-6 text-primary/20" />
											</div>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-bold truncate text-sm leading-tight text-foreground group-hover:text-primary transition-colors">
											{product.name}
										</p>
										<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
											{(product as any).category?.name || "Uncategorized"}
										</p>
									</div>
									<div className="text-right">
										<p className="font-black text-sm text-foreground">
											{formatCurrency(Number(product.price))}
										</p>
										<Badge
											variant={
												product.status === "ACTIVE" ? "success" : "secondary"
											}
											className="text-[9px] h-4 uppercase font-black px-1"
										>
											{product.status}
										</Badge>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default DashboardOverviewView;
