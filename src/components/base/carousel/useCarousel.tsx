import { useContext } from "react";
import { baseCarouselContext } from "./baseCarouselContext";

export const useCarousel = () => {
	const slider = useContext(baseCarouselContext);
	if (!slider) throw new Error("Missing BaseCarouselProvider in the tree");
	return slider;
};
