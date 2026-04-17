"use client";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { FCC } from "@/types";
import { CarouselButton } from "./CarouselButton";
import { CarouselDots } from "./CarouselDots";
import { useCarousel } from "./useCarousel";

type BaseCarouselAction = {
	className?: string;
	label?: ReactNode;
};

type BaseCarouselProps = {
	className?: string;
	containerClass?: string;
	dotClass?: string;
	dotWrapperClass?: string;
	enableDots?: boolean;
	disableAction?: boolean;
	options?: UseEmblaCarouselType;
	next?: BaseCarouselAction;
	prev?: BaseCarouselAction;
	baseClass?: string;
};

export const Carousel: FCC<BaseCarouselProps> = ({
	children,
	className,
	containerClass,
	disableAction = false,
	next,
	prev,
	enableDots = false,
	dotClass,
	dotWrapperClass,
	baseClass,
}) => {
	const { ref } = useCarousel();
	return (
		// <div className='relative'>
		<div className={cn("relative overflow-hidden group", baseClass)}>
			<div
				ref={ref}
				style={{ backfaceVisibility: "hidden" }}
				className={cn("overflow-hidden relative", containerClass)}
			>
				<div className={cn("flex  flex-row", className)}>{children}</div>
			</div>
			{!disableAction && (
				<>
					<CarouselButton
						// className={classMerge('w-12 h-12 right-5 -translate-y-1/2 bg-white/75 disabled:hidden absolute top-1/2 z-10 rounded-full group-hover:translate-x-[0%] translate-x-[200%]', next?.className)} action='next'>
						className={cn(
							`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-foreground/60 hover:text-foreground transition-all z-20 backdrop-blur-sm shadow-sm`,
							next?.className,
						)}
						action="next"
					>
						{next?.label ?? <ChevronRight className="font-extrabold" />}
					</CarouselButton>
					<CarouselButton
						// className={classMerge('w-12 h-12 left-5 -translate-y-1/2 disabled:hidden bg-white/75 absolute top-1/2 z-10 rounded-full group-hover:translate-x-[0%] -translate-x-[200%]', prev?.className)} action='prev'>
						className={cn(
							`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-foreground/60 hover:text-foreground transition-all z-20 backdrop-blur-sm shadow-sm`,
							prev?.className,
						)}
						action="prev"
					>
						{prev?.label ?? <ChevronLeft className="font-extrabold" />}
					</CarouselButton>
				</>
			)}
			{enableDots && (
				<CarouselDots dotClass={dotClass} dotWrapperClass={dotWrapperClass} />
			)}
		</div>
	);
};
