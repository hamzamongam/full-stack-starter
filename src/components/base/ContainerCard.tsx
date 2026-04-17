import type { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerCardProps {
	children: ReactNode;
	className?: string;
}

export const ContainerCard: FC<ContainerCardProps> = ({
	children,
	className,
}) => {
	return (
		<div className={cn("bg-card border rounded-2xl p-6 shadow-sm", className)}>
			{children}
		</div>
	);
};
