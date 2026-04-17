import type { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PageHeader } from "./PageHeader";

interface PageLayoutProps {
	children: ReactNode;
	title?: ReactNode;
	subtitle?: ReactNode;
	actions?: ReactNode;
	stats?: ReactNode;
	headerClassName?: string;
	contentClassName?: string;
	className?: string;
	animate?: boolean;
	gradientTitle?: boolean;
	isBack?: boolean;
}

export const PageLayout: FC<PageLayoutProps> = ({
	children,
	title,
	subtitle,
	actions,
	stats,
	headerClassName,
	contentClassName,
	className,
	animate = true,
	gradientTitle = true,
	isBack = true,
}) => {
	return (
		<div className={cn("w-full flex flex-col gap-4", className)}>
			{title && (
				<PageHeader
					title={title}
					subtitle={subtitle}
					actions={actions}
					stats={stats}
					className={headerClassName}
					gradientTitle={gradientTitle}
					isBack={isBack}
				/>
			)}
			<div
				className={cn(
					"w-full",
					animate &&
						"animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out fill-mode-both",
					contentClassName,
				)}
			>
				{children}
			</div>
		</div>
	);
};
