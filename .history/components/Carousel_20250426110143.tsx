"use client";

import {
  Carousel,
  CarouselContent,
  import CarouselItem from "./Carousel";
  CarouselNext,
  CarouselPrevious,
} from "./Carousel";

const slides = [
  {
    image:
      "https://res.cloudinary.com/ddldmru1u/image/upload/v1611311234/sample.jpg",
    title: "Camilan Renyah, Rasa Otentik!",
    subtitle: "Opak Sampeu Sutra",
    description: "Makanan Khas Indonesia",
  },
  {
    image:
      "https://res.cloudinary.com/ddldmru1u/image/upload/v1611311235/sample2.jpg",
    title: "Dengan Singkong Berkualitas",
    subtitle: "Opak Sampeu Premium",
    description: "Rasa Tradisional yang Tak Tertandingi",
  },
  {
    image:
      "https://res.cloudinary.com/ddldmru1u/image/upload/v1611311236/sample3.jpg",
    title: "Nikmati Setiap Gigitan",
    subtitle: "Opak Sampeu Pedas",
    description: "Pedas Gurih yang Menggoda",
  },
];

export default function HomeCarousel() {
  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <Carousel className="w-full">
        <CarouselContent className="w-full">
          {slides.map((slide, index) => (
            <CarouselItem
              key={index}
              className="w-full flex items-center justify-between"
            >
              {/* Teks */}
              <div className="w-1/2 p-8">
                <h2 className="text-4xl font-bold text-orange-600">
                  {slide.title}
                </h2>
                <h3 className="text-2xl font-semibold text-gray-800 mt-2">
                  {slide.subtitle}
                </h3>
                <p className="text-lg text-gray-600 mt-4">
                  {slide.description}
                </p>
              </div>
              {/* Gambar */}
              <div className="w-1/2">
                <img
                  src={slide.image}
                  alt={slide.title}
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
