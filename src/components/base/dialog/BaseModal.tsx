import React, { type FC, type PropsWithChildren, type ReactNode } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type BaseModalProps = {
	open: boolean;
	onOpenChange?: (open?: boolean) => void;
	title: string;
	description?: string;
	children?: ReactNode;
	confirmText?: string;
	cancelText?: string;
	isLoading?: boolean;
	variant?: "default" | "destructive";
	className?: string;
};

const BaseModal: FC<BaseModalProps> = ({
	open,
	onOpenChange,
	title,
	children,
	className,
}) => {
	return (
		<Dialog modal open={open} onOpenChange={onOpenChange}>
			<DialogContent className={cn("sm:max-w-[425px]", className)}>
				<DialogHeader>
					{title && <DialogTitle>{title}</DialogTitle>}
				</DialogHeader>
				<div>{children}</div>
			</DialogContent>
		</Dialog>
	);
};

export default BaseModal;
