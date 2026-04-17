import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { FCC } from "@/types";
import { useCarousel } from "./useCarousel";

export const CarouselButton: FCC<{
	className?: string;
	disabledClass?: string;
	action: "next" | "prev";
}> = ({ className, children, action, disabledClass }) => {
	const { scrollNext, scrollPrev, nextBtnDisabled, prevBtnDisabled } =
		useCarousel();
	const isDisabled = useMemo(
		() => (action === "next" ? nextBtnDisabled : (prevBtnDisabled ?? false)),
		[action, nextBtnDisabled, prevBtnDisabled],
	);
	return (
		<button
			type="button"
			disabled={
				action === "next" ? nextBtnDisabled : (prevBtnDisabled ?? false)
			}
			onClick={action === "next" ? scrollNext : scrollPrev}
			className={cn(className, isDisabled ? disabledClass : "", {
				"": isDisabled,
			})}
		>
			{children}
		</button>
	);
};
