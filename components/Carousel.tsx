"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import LoadingSpinner from "./Loading";
import Autoplay from "embla-carousel-autoplay";

export default function HomeCarousel() {
  const [slides, setSlides] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSlides() {
      try {
        setLoading(true);
        const response = await fetch("/api/banner/getBanner");
        const data = await response.json();

        console.log("Fetched Slides:", data); // Debugging log

        if (Array.isArray(data)) {
          const imageUrls = data.map((banner) => banner.imageUrl); // Ambil hanya URL gambar
          setSlides(imageUrls);
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Failed to fetch slides:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSlides();
  }, []);

  if (loading) {
    return <LoadingSpinner type="pulse" />;
  }

  if (slides.length === 0) {
    return (
      <p className="py-4 sm:py-8 md:py-12 lg:py-16 text-center text-gray-500">
        Tidak ada slide yang tersedia
      </p>
    );
  }

  return (
    <motion.div
      // Maintain px-20 for desktop but reduce padding on smaller screens
      className="w-full px-4 sm:px-8 md:px-12 lg:px-20 mx-auto py-6 sm:py-8 md:py-12 lg:py-16"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
        // Keep desktop styling intact
        className="w-full border-1 relative rounded-4xl overflow-hidden shadow-lg"
      >
        <CarouselContent className="-ml-0">
          {slides.map((url, index) => (
            <CarouselItem
              key={index}
              // More square for mobile, more rectangular for larger screens
              className="pl-0 basis-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[21/7] flex justify-center items-center"
            >
              <motion.div
                className="w-full h-full p-0 rounded-lg overflow-hidden relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Image
                  src={url}
                  alt={`Slide ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Keep desktop styling but adapt for mobile */}
        <div className="hidden sm:block">
          <CarouselPrevious className="absolute left-2 sm:left-4 md:left-6 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 sm:p-3 rounded-full shadow-md hover:bg-gray-100 z-10" />
          <CarouselNext className="absolute right-2 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 sm:p-3 rounded-full shadow-md hover:bg-gray-100 z-10" />
        </div>

        {/* Simple dots indicator for mobile only */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 sm:hidden">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full bg-white/70`}
            ></div>
          ))}
        </div>
      </Carousel>
    </motion.div>
  );
}
