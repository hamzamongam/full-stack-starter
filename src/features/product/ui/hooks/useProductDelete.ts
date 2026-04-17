import { useQueryClient } from "@tanstack/react-query";
import { confirm } from "@/components/base/dialog/confirm";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";

import type { TProduct } from "../../domain/product.schema";

interface ProductListResponse {
	data: TProduct[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

interface DeleteContext {
	previousProducts: ProductListResponse | undefined;
	queryKey: readonly unknown[];
}

export const useProductDelete = (id: string) => {
	const queryClient = useQueryClient();
	const { mutateAsync: deleteProduct } = useOrpcMutation(
		orpc.product.delete.mutationOptions({
			onMutate: async (id) => {
				const queryKey = orpc.product.getAll.queryKey({
					input: { page: 1, limit: 12 },
				});

				await queryClient.cancelQueries({ queryKey });

				const previousProducts =
					queryClient.getQueryData<ProductListResponse>(queryKey);

				queryClient.setQueryData<ProductListResponse>(queryKey, (old) => {
					if (!old) return old;
					return {
						...old,
						data: (old.data || []).filter((product) => product.id !== id),
						meta: {
							...old.meta,
							total: (old.meta?.total || 1) - 1,
						},
					};
				});

				return { previousProducts, queryKey } as DeleteContext;
			},
			onError: (_err, _id, context) => {
				if (context?.previousProducts) {
					queryClient.setQueryData(context.queryKey, context.previousProducts);
				}
			},
			onSettled: (_data, _error, _id, context) => {
				if (context?.queryKey) {
					queryClient.invalidateQueries({ queryKey: context.queryKey });
				}
			},
		}),
		{
			successMessage: "Product deleted successfully",
		},
	);
	const handleDelete = () => {
		confirm({
			title: "Delete Product",
			description:
				"Are you sure you want to delete this product? This action cannot be undone.",
			confirmText: "Delete",
			variant: "destructive",
			onConfirm: async () => {
				await deleteProduct(id);
			},
		});
	};

	return { handleDelete };
};
