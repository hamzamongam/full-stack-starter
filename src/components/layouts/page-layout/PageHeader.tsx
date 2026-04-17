import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { FC, ReactNode } from "react";
import { BaseButton } from "@/components/base/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
	title: ReactNode;
	subtitle?: ReactNode;
	actions?: ReactNode;
	stats?: ReactNode;
	className?: string;
	titleClassName?: string;
	gradientTitle?: boolean;
	isBack?: boolean;
}

export const PageHeader: FC<PageHeaderProps> = ({
	title,
	subtitle,
	actions,
	stats,
	className,
	titleClassName,
	gradientTitle = true,
	isBack = false,
}) => {
	const router = useRouter();

	return (
		<div
			className={cn(
				"flex flex-col justify-between gap-6 pb-2 md:flex-row md:items-end w-full",
				className,
			)}
		>
			<div className="flex items-start gap-4">
				{isBack && (
					<BaseButton
						variant="ghost"
						size="icon"
						onClick={() => router.history.back()}
						className="shrink-0"
					>
						<ArrowLeft className="size-5" />
					</BaseButton>
				)}
				<div className="space-y-1">
					<h1 className={cn("text-hero", titleClassName)}>
						<span className="text-primary font-bold text-2xl">{title}</span>
					</h1>
					{subtitle && (
						<div className="text-sm font-medium text-muted-foreground/60 flex items-center gap-2">
							{subtitle}
						</div>
					)}
				</div>
			</div>

			{(actions || stats) && (
				<div className="flex items-center gap-3">
					{stats && (
						<>
							<div className="hidden text-right sm:block">{stats}</div>
							<div className="mx-2 hidden h-10 w-[2px] bg-border/50 sm:block" />
						</>
					)}
					{actions && <div className="flex items-center gap-3">{actions}</div>}
				</div>
			)}
		</div>
	);
};
