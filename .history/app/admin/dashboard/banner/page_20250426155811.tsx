

export default function HomeCarousel() {
 
  return (
    <div className="w-full px-20 mx-auto py-16">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full relative rounded-4xl overflow-hidden shadow-lg"
      >
        <CarouselContent className="-ml-0">
          {slides.map((url, index) => (
            <CarouselItem
              key={index}
              className="pl-0 basis-full h-[500px] flex justify-center items-center"
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
