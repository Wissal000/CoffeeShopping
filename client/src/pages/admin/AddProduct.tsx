import { useState } from "react";
import axios from "axios";
import { ImagePlus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const categories = ["HOT", "COLD", "DESSERT"];

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("HOT");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select an image");
      return;
    }

    const loadingToast = toast.loading("Adding product...");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("image", image);
      formData.append("isAvailable", isAvailable ? "true" : "false");

      await axios.post("http://localhost:8000/api/products", formData);

      toast.success("Product added ✨", { id: loadingToast });

      setName("");
      setDescription("");
      setPrice("");
      setCategory("HOT");
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed ❌", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-14">
        {/* ================= LEFT ================= */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-10"
        >
          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              New Product
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Add a new item to your menu
            </p>
          </div>

          {/* FORM */}
          <div className="space-y-6">
            {/* NAME */}
            <div>
              <label className="text-xs text-gray-500">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 
              focus:border-white/30 focus:bg-white/[0.05] outline-none transition text-sm"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-xs text-gray-500">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 
              focus:border-white/30 focus:bg-white/[0.05] outline-none transition text-sm"
              />
            </div>

            {/* PRICE + CATEGORY */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 
                focus:border-white/30 focus:bg-white/[0.05] outline-none transition text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Category</label>
                <div className="flex gap-2 mt-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex-1 py-2 text-xs rounded-md border transition
                    ${
                      category === cat
                        ? "bg-white text-black border-white"
                        : "border-white/10 text-gray-400 hover:text-white"
                    }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AVAILABILITY */}
            <div className="flex items-center justify-between border border-white/10 rounded-lg px-4 py-3">
              <div>
                <p className="text-sm">Available</p>
                <p className="text-xs text-gray-500">Visible to customers</p>
              </div>

              <button
                type="button"
                onClick={() => setIsAvailable((prev) => !prev)}
                className={`w-10 h-5 flex items-center rounded-full p-1 transition
              ${isAvailable ? "bg-white" : "bg-white/20"}`}
              >
                <div
                  className={`w-3 h-3 bg-black rounded-full transition
                ${isAvailable ? "translate-x-5" : ""}`}
                />
              </button>
            </div>

            {/* IMAGE */}
            <label className="flex flex-col items-center justify-center border border-dashed border-white/15 rounded-lg p-8 cursor-pointer hover:border-white/30 transition">
              <ImagePlus className="w-5 h-5 text-gray-500 mb-2" />
              <span className="text-xs text-gray-500">
                Upload product image
              </span>

              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    const file = e.target.files[0];
                    setImage(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </label>

            {/* ACTION */}
            <button
              className="w-full py-2.5 rounded-lg bg-white text-black text-sm font-medium 
            hover:opacity-90 transition"
            >
              Create Product
            </button>
          </div>
        </motion.form>

        {/* ================= RIGHT ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start"
        >
          <div className="w-full border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
            {/* PREVIEW HEADER */}
            <div className="px-4 py-3 border-b border-white/10 text-xs text-gray-500">
              Preview
            </div>

            {/* CARD */}
            <div className="p-4">
              <div className="rounded-lg overflow-hidden border border-white/10">
                {/* IMAGE */}
                <div className="h-48 bg-black/40">
                  {preview ? (
                    <img src={preview} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-600 text-xs">
                      No image
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">
                      {name || "Product name"}
                    </p>

                    <span className="text-sm">
                      {price ? `${price} MAD` : "--"}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2">
                    {description || "Product description"}
                  </p>

                  <div className="pt-2">
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full
                    ${
                      isAvailable
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                    >
                      {isAvailable ? "In stock" : "Hidden"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-gray-600 mt-3">
                Live preview updates automatically
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProduct;
