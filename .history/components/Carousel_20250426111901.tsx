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
        const response = await fetch("/api/banner/getBanner"); // Ambil gambar dari folder "banner"
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
          {slides.map((url, index) => (
            <CarouselItem key={index} className="w-full">
              <img
                src={url}
                alt={`Slide ${index + 1}`}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
