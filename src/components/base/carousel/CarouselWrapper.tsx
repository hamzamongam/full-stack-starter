import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel, {
	type UseEmblaCarouselType,
} from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import type { FCC } from "@/types";
import { baseCarouselContext } from "./baseCarouselContext";
import type { BaseCarouselProps } from "./type";

export const CarouselWrapper: FCC<BaseCarouselProps> = ({
	children,
	options,
	autoPlay = false,
}) => {
	const { Provider } = baseCarouselContext;
	const [emblaRef, emblaApi] = useEmblaCarousel(options, [
		Autoplay({ active: autoPlay }),
	]);
	const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
	const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

	const onInit = useCallback((emblaApi: UseEmblaCarouselType["1"]) => {
		if (emblaApi) {
			setScrollSnaps(emblaApi?.scrollSnapList());
		}
	}, []);

	const onSelect = useCallback((emblaApi: UseEmblaCarouselType["1"]) => {
		if (emblaApi) {
			setSelectedIndex(emblaApi.selectedScrollSnap());
			setPrevBtnDisabled(!emblaApi.canScrollPrev());
			setNextBtnDisabled(!emblaApi.canScrollNext());
		}
	}, []);

	const scrollTo = useCallback(
		(index: number) => emblaApi?.scrollTo(index),
		[emblaApi],
	);

	useEffect(() => {
		if (!emblaApi) return;
		onInit(emblaApi);
		onSelect(emblaApi);
		emblaApi.on("reInit", onInit);
		emblaApi.on("reInit", onSelect);
		emblaApi.on("select", onSelect);
	}, [emblaApi, onInit, onSelect]);

	return (
		<Provider
			value={{
				selectedIndex,
				scrollSnaps,
				scrollTo,
				prevBtnDisabled,
				nextBtnDisabled,
				scrollNext,
				scrollPrev,
				ref: emblaRef,
			}}
		>
			{children}
		</Provider>
	);
};
