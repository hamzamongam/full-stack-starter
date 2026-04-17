"use client";
import { createContext, useContext } from "react";
import type { BaseCarouselValue } from "./type";

export const baseCarouselContext = createContext<BaseCarouselValue>({});
