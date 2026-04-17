import { TriangleAlert } from "lucide-react";
import type { FC, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	children?: ReactNode;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	isLoading?: boolean;
	variant?: "default" | "destructive";
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
	open,
	onOpenChange,
	title,
	description,
	children,
	confirmText = "Confirm",
	cancelText = "Cancel",
	onConfirm,
	isLoading = false,
	variant = "default",
}) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-4">
						<div
							className={cn(
								"size-10 rounded-full flex items-center justify-center",
								variant === "destructive"
									? "bg-red-100 text-red-600"
									: "bg-primary/10 text-primary",
							)}
						>
							<TriangleAlert className="size-5" />
						</div>
						<div>
							<DialogTitle>{title}</DialogTitle>
							{description && (
								<DialogDescription className="mt-1">
									{description}
								</DialogDescription>
							)}
						</div>
					</div>
				</DialogHeader>

				{children && <div className="py-2">{children}</div>}

				<DialogFooter className="gap-2 sm:gap-0 mt-4">
					<DialogClose>
						<Button variant="outline" type="button" disabled={isLoading}>
							{cancelText}
						</Button>
					</DialogClose>
					<Button variant={variant} onClick={onConfirm} disabled={isLoading}>
						{isLoading ? "Processing..." : confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
