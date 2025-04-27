"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

export default function HomeCarousel() {
  const [slides, setSlides] = useState<string[]>([]);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const response = await fetch("/api/banner/getBanner");
        const data = await response.json();

        console.log("Fetched Slides:", data);

        if (Array.isArray(data)) {
          setSlides(data);
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Failed to fetch slides:", error);
      }
    }

    fetchSlides();
  }, []);

  if (slides.length === 0) {
    return <p className="py-16 text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="relative mx-auto w-full h-full px20 md:px-20 py-16">
      <Carousel className="w-full relative rounded-xl overflow-hidden shadow-lg bg-red-400">
        <CarouselContent className="w-full">
          {slides.map((url, index) => (
            <CarouselItem
              key={index}
              className="w-full h-full flex justify-center items-center"
            >
              <div className="w-full max-w-6xl h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg flex items-center justify-center bg-white">
                <img
                  src={url}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 z-10" />
        <CarouselNext className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 z-10" />
      </Carousel>
    </div>
  );
}
