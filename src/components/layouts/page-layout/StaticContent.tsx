import type { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StaticContentProps {
	children: ReactNode;
	className?: string;
}

export const StaticContent: FC<StaticContentProps> = ({
	children,
	className,
}) => {
	return (
		<div
			className={cn(
				"prose prose-sm md:prose-base dark:prose-invert max-w-none",
				"prose-headings:text-primary prose-headings:font-bold prose-headings:tracking-tight",
				"prose-p:text-muted-foreground prose-p:leading-relaxed",
				"prose-strong:text-foreground prose-strong:font-semibold",
				"prose-ul:list-disc prose-ul:pl-5",
				"prose-li:text-muted-foreground prose-li:mb-2",
				className,
			)}
		>
			{children}
		</div>
	);
};
