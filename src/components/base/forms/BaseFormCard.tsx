import type { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BaseFormCardProps {
	title?: string;
	children: ReactNode;
	className?: string;
	description?: string;
}

export const BaseFormCard: FC<BaseFormCardProps> = ({
	title,
	children,
	className,
	description,
}) => {
	return (
		<div
			className={cn(
				"space-y-4 dark:bg-stone-900  bg-gray-50 rounded-md p-4	",
				className,
			)}
		>
			{title && (
				<div className="border-b pb-2">
					<h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">
						{title}
					</h3>
					{description && (
						<p className="text-sm text-muted-foreground mt-1">{description}</p>
					)}
				</div>
			)}
			{children}
		</div>
	);
};
