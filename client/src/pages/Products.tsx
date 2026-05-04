import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Footer from "../components/footer";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

interface Product {
  isAvailable: any;
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  category: string;
}

const categories = ["ALL", "HOT", "COLD", "DESSERT"];

const API = "http://localhost:8000";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart } = useCart();

  const fetchProducts = async (
    category: string,
    pageNumber: number,
    signal: AbortSignal,
  ) => {
    try {
      setLoading(true);
      setError("");

      const url =
        category !== "ALL"
          ? `${API}/api/products?category=${category}&page=${pageNumber}`
          : `${API}/api/products?page=${pageNumber}`;

      const res = await axios.get(url, { signal });

      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err: any) {
      if (err.name !== "CanceledError") {
        console.error(err);
        setError("Failed to load products");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(activeCategory, page, controller.signal);
    return () => controller.abort();
  }, [activeCategory, page]);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0a0a0b]" />
        <div className="absolute w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-3xl -top-40 -left-40" />
        <div className="absolute w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl bottom-[-150px] right-[-150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* ===== HEADER ===== */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Menu
            </span>
          </h1>

          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Explore our selection of drinks, desserts, and fresh flavors.
          </p>
        </div>

        {/* ===== FILTERS ===== */}
        <div className="flex justify-center mb-16">
          <div className="flex gap-2 p-1 rounded-full bg-white/5 border border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setPage(1);
                }}
                className={`px-5 py-2 text-sm rounded-full transition-all
              ${
                activeCategory === cat
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ===== ERROR ===== */}
        {error && (
          <p className="text-center text-red-400 text-sm mb-6">{error}</p>
        )}

        {/* ===== GRID ===== */}
        <div
          className={`transition ${
            loading ? "opacity-40 pointer-events-none" : ""
          }`}
        >
          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-sm">
                No items found in this category
              </p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group rounded-xl overflow-hidden bg-white/[0.02] border border-white/10 
              hover:border-white/20 transition"
              >
                {/* IMAGE */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* CATEGORY */}
                  <span className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full bg-black/50 backdrop-blur">
                    {product.category}
                  </span>

                  {/* OUT OF STOCK */}
                  {!product.isAvailable && (
                    <span className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full bg-red-500 text-white">
                      Sold out
                    </span>
                  )}

                  {/* ADD TO CART */}
                  <button
                    disabled={!product.isAvailable}
                    onClick={() => {
                      if (!product.isAvailable) return;

                      addToCart({
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1,
                      });

                      toast.success("Added to cart");
                    }}
                    className={`absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition
                  ${
                    product.isAvailable
                      ? "bg-white text-black hover:scale-110"
                      : "bg-white/10 text-gray-500 cursor-not-allowed"
                  }`}
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">{product.name}</h3>
                    <span className="text-sm font-semibold">
                      {product.price} MAD
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ===== PAGINATION ===== */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-16">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 text-xs rounded-md transition
              ${
                page === i + 1
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Products;
