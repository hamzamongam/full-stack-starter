import type { EmblaOptionsType } from "embla-carousel";
import type { UseEmblaCarouselType } from "embla-carousel-react";

export type BaseCarouselProps = {
	autoPlay?: boolean;
	options?: EmblaOptionsType;
};

export type BaseCarouselValue = {
	selectedIndex?: number;
	scrollSnaps?: number[];
	scrollTo?: (index: number) => void;
	nextBtnDisabled?: boolean;
	prevBtnDisabled?: boolean;
	ref?: UseEmblaCarouselType["0"];
	scrollPrev?: () => void;
	scrollNext?: () => void;
};
