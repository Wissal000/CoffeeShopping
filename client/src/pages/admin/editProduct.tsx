import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { Product, Category } from "../../types/product";

const API = "http://localhost:8000";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  image: string;
  category: Category;
  isAvailable: boolean;
}

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProductModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: Readonly<EditProductModalProps>) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "HOT",
    isAvailable: true,
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description || "",
        price: String(product.price),
        image: product.image,
        category: product.category,
        isAvailable: product.isAvailable,
      });
      setPreview(product.image);
      setFile(null);
    }
  }, [product]);

  const handleClose = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      image: "",
      category: "HOT",
      isAvailable: true,
    });
    setPreview("");
    setFile(null);
    onClose();
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!product) return;

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "image") data.append(key, String(value));
      });

      if (file) data.append("image", file);

      await axios.put(`${API}/api/products/${product.id}`, data);

      toast.success("Product updated ✨");
      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        onClick={handleClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ y: 40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-5"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Edit Product</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* IMAGE */}
          {(preview || form.image) && (
            <img
              src={preview || form.image}
              alt="preview"
              className="w-60 h-44 object-cover rounded-xl border border-white/10 mx-auto"
            />
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NAME + PRICE */}
            <div className="grid grid-cols-2 gap-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="input"
              />
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                type="number"
                placeholder="Price"
                className="input"
              />
            </div>

            {/* DESCRIPTION */}
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="input"
            />

            {/* CATEGORY */}
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input"
            >
              <option value="HOT">HOT</option>
              <option value="COLD">COLD</option>
              <option value="DESSERT">DESSERT</option>
            </select>

            {/* AVAILABILITY TOGGLE */}
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3">
              <div>
                <p className="text-sm">Availability</p>
                <p className="text-xs text-gray-400">Visible to customers</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    isAvailable: !prev.isAvailable,
                  }))
                }
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  form.isAvailable ? "bg-yellow-400" : "bg-white/20"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-black rounded-full transition ${
                    form.isAvailable ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* FILE */}
            <input
              type="file"
              onChange={handleFileChange}
              className="text-xs text-gray-400 file:mr-3 file:px-3 file:py-1 file:rounded-md file:border-0 file:bg-yellow-400 file:text-black"
            />

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                className="px-4 py-1.5 text-sm rounded-md bg-yellow-400 text-black font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      {/* 🔥 SHARED INPUT STYLE */}
      <style>{`
        .input {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 14px;
          outline: none;
        }
        .input:focus {
          border-color: #facc15;
        }
      `}</style>
    </AnimatePresence>
  );
}
