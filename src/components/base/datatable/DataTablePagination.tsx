import type { Table } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
}

export function DataTablePagination<TData>({
	table,
}: DataTablePaginationProps<TData>) {
	return (
		<div className="flex items-center justify-between px-2 py-4">
			<div className="flex-1 text-sm text-muted-foreground/60 font-medium">
				{table.getFilteredSelectedRowModel().rows.length} of{" "}
				{table.getFilteredRowModel().rows.length} row(s) selected.
			</div>
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2 text-muted-foreground/60">
					<p className="text-xs font-black uppercase tracking-widest">
						Rows per page
					</p>
					<select
						className="flex h-8 w-[70px] bg-muted/20 hover:bg-muted/40 transition-colors rounded-lg border border-border/50 text-xs font-bold focus:ring-1 focus:ring-primary outline-none cursor-pointer"
						value={`${table.getState().pagination.pageSize}`}
						onChange={(e) => {
							table.setPageSize(Number(e.target.value));
						}}
					>
						{[10, 20, 30, 40, 50].map((pageSize) => (
							<option key={pageSize} value={`${pageSize}`}>
								{pageSize}
							</option>
						))}
					</select>
				</div>
				<div className="flex w-[100px] items-center justify-center text-xs font-black uppercase tracking-widest text-muted-foreground/60">
					Page {table.getState().pagination.pageIndex + 1} of{" "}
					{table.getPageCount()}
				</div>
				<div className="flex items-center space-x-2">
					<button
						type="button"
						className="hidden h-9 w-9 items-center justify-center p-0 lg:flex rounded-xl border border-border/50 bg-background hover:bg-muted transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to first page</span>
						<ChevronsLeft className="h-4 w-4" />
					</button>
					<button
						type="button"
						className="h-9 w-9 items-center justify-center p-0 rounded-xl border border-border/50 bg-background hover:bg-muted transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeft className="h-4 w-4" />
					</button>
					<button
						type="button"
						className="h-9 w-9 items-center justify-center p-0 rounded-xl border border-border/50 bg-background hover:bg-muted transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRight className="h-4 w-4" />
					</button>
					<button
						type="button"
						className="hidden h-9 w-9 items-center justify-center p-0 lg:flex rounded-xl border border-border/50 bg-background hover:bg-muted transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to last page</span>
						<ChevronsRight className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
