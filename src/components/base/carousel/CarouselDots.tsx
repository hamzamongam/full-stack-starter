import type React from "react";
import type { FC, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { useCarousel } from "./useCarousel";

type PropType = PropsWithChildren<
	React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	>
>;

export const CarouselDots: FC<{
	dotClass?: string;
	dotWrapperClass?: string;
}> = ({ dotClass, dotWrapperClass }) => {
	const { scrollSnaps, scrollTo, selectedIndex } = useCarousel();
	if (!scrollSnaps) return null;
	return (
		<div className={cn("flex gap-x-3 py-4 justify-center", dotWrapperClass)}>
			{scrollSnaps.map((_, index) => (
				<BaseCarouselDot
					data-active={index === selectedIndex}
					disabled={index === selectedIndex}
					className={cn(
						"w-1.5 h-1.5 rounded-full transition-all duration-300",
						dotClass,
						{
							"bg-primary w-4": index === selectedIndex,
						},
					)}
					onClick={() => scrollTo?.(index)}
					key={`${index}-item`}
				/>
			))}
		</div>
	);
};

const BaseCarouselDot: FC<PropType> = (props) => {
	const { children, ...restProps } = props;
	return (
		<button type="button" {...restProps}>
			{children}
		</button>
	);
};
