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
    <div className="container mx-auto px-4 py-16">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full relative rounded-xl overflow-hidden shadow-lg"
      >
        <CarouselContent>
          {slides.map((url, index) => (
            <CarouselItem
              key={index}
              className="md:basis-2/3 lg:basis-3/4 h-[500px] flex justify-center items-center"
            >
              <div className="w-full h-full p-0 rounded-lg overflow-hidden">
                <img
                  src={url}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-md hover:bg-gray-100 z-10" />
        <CarouselNext className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-md hover:bg-gray-100 z-10" />
      </Carousel>
    </div>
  );
}
