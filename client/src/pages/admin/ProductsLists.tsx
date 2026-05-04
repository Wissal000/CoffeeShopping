import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import EditProductModal from "../admin/editProduct";
import type { Product } from "../../types/product";
import { toast } from "sonner";

const categories = ["ALL", "HOT", "COLD", "DESSERT"];
const API = "http://localhost:8000";

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ===== FETCH =====
  const fetchProducts = async (
    category: string,
    pageNumber: number,
    signal?: AbortSignal,
  ) => {
    try {
      setLoading(true);
      setError("");

      const url =
        category !== "ALL"
          ? `${API}/api/products?category=${category}&page=${pageNumber}`
          : `${API}/api/products?page=${pageNumber}`;

      const res = await axios.get(url, signal ? { signal } : {});

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

  const refreshProducts = () => {
    fetchProducts(activeCategory, page);
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(activeCategory, page, controller.signal);
    return () => controller.abort();
  }, [activeCategory, page]);

  // ===== DELETE =====
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  // ===== EDIT =====
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen text-white">
      {/* ===== CONTAINER ===== */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* ===== TOP BAR ===== */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Products</h1>
            <p className="text-gray-400 text-sm">Manage your coffee menu</p>
          </div>

          <button
            onClick={() => navigate("/admin/add-product")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full 
  bg-gradient-to-r from-yellow-400 to-orange-400 
  text-black font-semibold text-sm 
  shadow-md hover:shadow-lg 
  hover:scale-[1.03] active:scale-95 
  transition-all duration-200"
          >
            <span className="text-lg leading-none">+</span>
            Add Product
          </button>
        </div>

        {/* ===== FILTERS ===== */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                activeCategory === cat
                  ? "bg-yellow-400 text-black"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ===== STATES ===== */}
        {error && <p className="text-center text-red-400 mb-6">{error}</p>}
        {loading && <p className="text-center text-gray-500">Loading...</p>}

        {/* ===== GRID ===== */}
        {!loading && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="group rounded-2xl overflow-hidden 
  bg-white/[0.04] border border-white/10 
  hover:border-white/20 hover:bg-white/[0.06]
  transition-all duration-300 backdrop-blur-xl"
              >
                {/* IMAGE */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition duration-500 
      ${product.isAvailable ? "group-hover:scale-105" : "opacity-50 grayscale"}`}
                  />

                  {/* CATEGORY */}
                  <span className="absolute top-2 left-2 bg-black/50 backdrop-blur px-2 py-1 text-[10px] rounded-md text-gray-300">
                    {product.category}
                  </span>

                  {/* STATUS BADGE */}
                  <span
                    className={`absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 text-[10px] rounded-full border backdrop-blur-md ${
                      product.isAvailable
                        ? "bg-green-500/10 text-green-700 border-green-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        product.isAvailable ? "bg-green-400" : "bg-red-400"
                      }`}
                    />
                    {product.isAvailable ? "In Stock" : "Sold Out"}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-white/90">
                      {product.name}
                    </h3>

                    <span className="text-yellow-400 font-semibold text-sm">
                      {product.price} MAD
                    </span>
                  </div>

                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                    {product.description}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 py-1.5 text-xs rounded-md 
        bg-white/5 hover:bg-white/10 
        text-gray-300 hover:text-white
        transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 py-1.5 text-xs rounded-md 
        bg-red-500/10 hover:bg-red-500 
        text-red-400 hover:text-white
        transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ===== PAGINATION ===== */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 bg-white/5 rounded-lg disabled:opacity-30"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  page === i + 1
                    ? "bg-yellow-400 text-black"
                    : "bg-white/5 text-gray-400"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 bg-white/5 rounded-lg disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ===== MODAL ===== */}
      <EditProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSuccess={refreshProducts}
      />
    </div>
  );
};

export default Products;
