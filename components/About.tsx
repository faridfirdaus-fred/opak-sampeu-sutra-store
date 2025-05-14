import Image from "next/image";

const About = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-20">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <div className="lg:w-1/2">
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/about1.webp"
                alt="About Us"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 mb-6">
              Welcome to our world of sustainable fashion and conscious living.
              We believe in creating beautiful products that not only look good
              but also do good for our planet and its people.
            </p>
            <p className="text-lg text-gray-600">
              Founded with a passion for traditional craftsmanship and modern
              design, we have been on a journey to redefine what it means to be a
              sustainable fashion brand in today&apos;s world.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
          <div className="lg:w-1/2">
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/feature.webp"
                alt="Our Features"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What Makes Us Different
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Sustainable Materials
                  </h3>
                  <p className="text-gray-600">
                    We use only eco-friendly materials that are kind to our
                    planet.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Timeless Design
                  </h3>
                  <p className="text-gray-600">
                    Our pieces are designed to last, transcending seasonal
                    trends.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ethical Production
                  </h3>
                  <p className="text-gray-600">
                    We ensure fair wages and safe working conditions for all our
                    artisans.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
