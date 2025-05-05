"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import HomeCarousel from "../components/Carousel";
import HighlightedProducts from "../components/HighlightedProduct";
import ProductFeature from "../components/ProductFeature";

export default function Home() {
  // Gunakan useInView di dalam fungsi komponen
  const [carouselRef, carouselInView] = useInView({ triggerOnce: true });
  const [highlightedRef, highlightedInView] = useInView({ triggerOnce: true });
  const [featureRef, featureInView] = useInView({ triggerOnce: true });

  return (
    <div>
      {/* HomeCarousel with scroll animation */}
      <motion.div
        ref={carouselRef}
        initial={{ opacity: 0, y: 50 }}
        animate={carouselInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <HomeCarousel />
      </motion.div>

      {/* HighlightedProducts with scroll animation */}
      <motion.div
        ref={highlightedRef}
        initial={{ opacity: 0, y: 50 }}
        animate={highlightedInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <HighlightedProducts />
      </motion.div>

      {/* ProductFeature with scroll animation */}
      <motion.div
        ref={featureRef}
        initial={{ opacity: 0, y: 50 }}
        animate={featureInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      >
        <ProductFeature />
      </motion.div>
    </div>
  );
}
