"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { confirm } from "@/components/base/dialog/confirm";
import { Button } from "@/components/ui/button";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";
import type { TMedia, TMediaType } from "../../domain/media.schema";

interface MediaLibraryGridProps {
	type?: TMediaType;
	onSelect: (metadata: { id: string; url: string; altText?: string }) => void;
	selectedUrls?: string[];
	allowDelete?: boolean;
}

interface InfiniteMediaData {
	pages: {
		data: TMedia[];
		meta: {
			total: number;
			page: number;
			limit: number;
			totalPages: number;
		};
	}[];
	pageParams: number[];
}

export function MediaLibraryGrid({
	onSelect,
	selectedUrls = [],
	allowDelete = false,
	type,
}: MediaLibraryGridProps) {
	const [search] = useState("");
	const queryClient = useQueryClient();
	const { mutateAsync: deleteMedia, isPending: isDeleting } = useOrpcMutation(
		orpc.media.delete.mutationOptions({
			onMutate: async ({ id }) => {
				// Cancel and update ALL media.getAll queries.
				const queryRoot = ["media", "getAll"];
				await queryClient.cancelQueries({ queryKey: queryRoot });

				// Update all matching queries in cache
				queryClient.setQueriesData<InfiniteMediaData>(
					{ queryKey: queryRoot },
					(old) => {
						if (!old) return old;
						return {
							...old,
							pages: old.pages.map((page) => ({
								...page,
								data: (page.data || []).filter((item) => item.id !== id),
							})),
						};
					},
				);

				return { queryKey: queryRoot };
			},
			onError: () => {
				toast.error("Failed to delete media");
			},
			onSettled: () => {
				queryClient.invalidateQueries({ queryKey: ["media", "getAll"] });
			},
		}),
	);

	const handleDelete = async (e: React.MouseEvent, id: string) => {
		e.stopPropagation();
		confirm({
			title: "Delete Media",
			description:
				"Are you sure you want to delete this media? This action cannot be undone.",
			confirmText: "Delete",
			variant: "destructive",
			onConfirm: async () => {
				try {
					await deleteMedia({ id });
					toast.success("Media deleted successfully");
				} catch (error) {
					console.error(error);
				}
			},
		});
	};

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
	} = useInfiniteQuery(
		orpc.media.getAll.infiniteOptions({
			input: (pageParam) => ({
				type,
				limit: 20,
				search: search || undefined,
				page: (pageParam as number) || 1,
			}),
			initialPageParam: 1,
			getNextPageParam: (lastPage) =>
				lastPage.meta.page < lastPage.meta.totalPages
					? lastPage.meta.page + 1
					: undefined,
		}),
	);

	const items = useMemo(() => {
		return data?.pages.flatMap((page) => page.data) ?? [];
	}, [data]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-12">
				<Loader2 className="size-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="text-center py-12 text-destructive">
				Failed to load media.
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="text-center py-12 text-muted-foreground">
				No media found.
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
				{items.map((item) => {
					const isSelected = selectedUrls.includes(item.url);
					return (
						<button
							type="button"
							key={item.id}
							className={`relative aspect-square rounded overflow-hidden border-2 cursor-pointer transition-all group ${
								isSelected
									? "border-primary"
									: "border-transparent hover:border-gray-200"
							}`}
							onClick={() =>
								onSelect({
									id: item.id,
									url: item.url,
									altText: item.altText || item.fileName,
								})
							}
						>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={item.url}
								alt={item.altText || item.fileName}
								className="w-full h-full object-cover"
							/>
							{isSelected && (
								<div className="absolute top-2 right-2 bg-background rounded-full">
									<CheckCircle2 className="size-5 text-primary" />
								</div>
							)}

							{allowDelete && (
								<button
									type="button"
									disabled={isDeleting}
									onClick={(e) => handleDelete(e, item.id)}
									className="absolute bottom-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
								>
									<Trash2 className="size-4" />
								</button>
							)}
						</button>
					);
				})}
			</div>

			{hasNextPage && (
				<div className="mt-4 flex justify-center">
					<Button
						variant="outline"
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage}
					>
						{isFetchingNextPage ? (
							<>
								<Loader2 className="size-4 mr-2 animate-spin" />
								Loading...
							</>
						) : (
							"Load More"
						)}
					</Button>
				</div>
			)}
		</div>
	);
}
