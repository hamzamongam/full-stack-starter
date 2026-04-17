import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface DataTableSkeletonProps {
	columnCount: number;
	rowCount?: number;
	searchable?: boolean;
}

export function DataTableSkeleton({
	columnCount,
	rowCount = 10,
	searchable = true,
}: DataTableSkeletonProps) {
	return (
		<div className="w-full space-y-4">
			{searchable && (
				<div className="max-w-sm">
					<Skeleton className="h-11 w-full rounded-2xl" />
				</div>
			)}
			<div className="glass-card rounded-[2rem] overflow-hidden border border-border/50">
				<Table>
					<TableHeader className="bg-muted/30">
						<TableRow className="hover:bg-transparent border-border/50">
							{Array.from({ length: columnCount }).map((_, i) => (
								<TableHead
									// biome-ignore lint/suspicious/noArrayIndexKey: skeleton
									key={`header-${i}`}
									className="h-14"
								>
									<Skeleton className="h-4 w-20" />
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: rowCount }).map((_, i) => (
							<TableRow
								key={`row-${i}-${rowCount}`}
								className="border-border/30"
							>
								{Array.from({ length: columnCount }).map((_, j) => (
									<TableCell
										key={`cell-${i}-${j}-${columnCount}`}
										className="py-4"
									>
										<Skeleton className="h-5 w-full" />
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-between px-2 py-4">
				<Skeleton className="h-4 w-40" />
				<div className="flex items-center space-x-6">
					<Skeleton className="h-8 w-20" />
					<Skeleton className="h-8 w-40" />
				</div>
			</div>
		</div>
	);
}
