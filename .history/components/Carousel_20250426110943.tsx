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
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const response = await fetch("/api/cloudinary");
        const data = await response.json();
        setSlides(data);
      } catch (error) {
        console.error("Failed to fetch slides:", error);
      }
    }

    fetchSlides();
  }, []);

  if (slides.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <Carousel className="w-full">
        <CarouselContent className="w-full">
          {slides.map((slide, index) => (
            <CarouselItem
              key={index}
              className="w-full flex flex-col md:flex-row items-center justify-between gap-8"
            >
              {/* Teks */}
              <div className="w-full md:w-1/2 p-8 text-center md:text-left">
                <h2 className="text-4xl font-bold text-orange-600">
                  {slide.title || "Default Title"}
                </h2>
                <p className="text-lg text-gray-600 mt-4">
                  {slide.description || "Default Description"}
                </p>
              </div>
              {/* Gambar */}
              <div className="w-full md:w-1/2">
                <img
                  src={slide.url}
                  alt={slide.title || "Slide Image"}
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
