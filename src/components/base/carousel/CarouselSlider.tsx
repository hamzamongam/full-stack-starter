import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { FCC } from "@/types";

export const CarouselSlider: FCC<{
	style?: CSSProperties;
	className?: string;
}> = ({ children, className, style }) => {
	return (
		<div style={style} className={cn("shrink-0 grow-0 max-w-full", className)}>
			{children}
		</div>
	);
};
