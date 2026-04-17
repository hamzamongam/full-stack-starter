import { Link } from "@tanstack/react-router";
import { Eye, Pencil, Trash } from "lucide-react";
import type { FC } from "react";
import { BaseButton } from "@/components/base/button";
import { useProductDelete } from "../hooks/useProductDelete";

// import { useProductDelete } from "../hooks/useProductDelete";

interface ProductRowActionsProps {
	id: string;
	onDelete?: (id: string) => void;
}

export const ProductActionRow: FC<ProductRowActionsProps> = ({ id }) => {
	const { handleDelete } = useProductDelete(id);

	return (
		<div className="flex items-center gap-2">
			<BaseButton
				variant="ghost"
				className="size-8 p-0 dark:text-white text-primary   hover:text-primary hover:bg-primary/10"
				render={
					<Link to="/admin/products/$productId" params={{ productId: id }} />
				}
			>
				<Eye className="size-4 dark:text-white" />
			</BaseButton>
			<BaseButton
				variant="ghost"
				className="size-8 p-0 dark:text-white text-primary hover:text-orange-500 hover:bg-orange-500/10"
				render={
					<Link
						to="/admin/products/edit/$productId"
						params={{ productId: id }}
					/>
				}
			>
				<Pencil className="size-4 dark:text-white" />
			</BaseButton>
			<BaseButton
				variant="ghost"
				className="size-8 p-0 text-primary  hover:text-red-500 hover:bg-red-500/10"
				onClick={handleDelete}
			>
				<Trash className="size-4 dark:text-white" />
			</BaseButton>
		</div>
	);
};
