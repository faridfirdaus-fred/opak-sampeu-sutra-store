// In your HighlightedProducts component
import { useState, useEffect } from "react";

export default function HighlightedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHighlightedProducts() {
      try {
        const response = await fetch("/api/products/highlighted");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch highlighted products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHighlightedProducts();
  }, []);

  // Rest of your component remains the same
}
