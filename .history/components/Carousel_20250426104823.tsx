"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./Carousel";

const images = [
  "https://res.cloudinary.com/ddldmru1u/image/upload/v1611311234/sample.jpg",
  "https://res.cloudinary.com/ddldmru1u/image/upload/v1611311235/sample2.jpg",
  "https://res.cloudinary.com/ddldmru1u/image/upload/v1611311236/sample3.jpg",
];

export default function HomeCarousel() {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <Carousel className="w-full">
        <CarouselContent className="w-full">
          {images.map((image, index) => (
            <CarouselItem key={index} className="w-full">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-auto object-cover rounded-lg"
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
