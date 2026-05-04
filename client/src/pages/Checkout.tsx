import { useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API = "http://localhost:8000";

const Checkout = () => {
  const { cart, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    phone: "",
    address: "",
    paymentMethod: "cash",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API}/api/orders`, {
        ...form,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      clearCart();

      toast.success("Order placed successfully 🎉");

      navigate("/landing");
    } catch (error) {
      console.error(error);
      toast.error("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0705] text-white px-6 py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <h1 className="text-4xl font-semibold mb-4">Checkout</h1>

          <p className="text-gray-400 mb-10">
            Complete your order by filling the details below.
          </p>

          <div className="space-y-6">
            {/* INPUT */}
            <div>
              <label className="text-sm text-gray-400">Full Name</label>
              <input
                name="customerName"
                onChange={handleChange}
                className="w-full mt-2 px-0 py-2 bg-transparent border-b border-white/20 
              focus:border-yellow-400 outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input
                name="customerEmail"
                onChange={handleChange}
                className="w-full mt-2 px-0 py-2 bg-transparent border-b border-white/20 
              focus:border-yellow-400 outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Phone</label>
              <input
                name="phone"
                onChange={handleChange}
                className="w-full mt-2 px-0 py-2 bg-transparent border-b border-white/20 
              focus:border-yellow-400 outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Address</label>
              <input
                name="address"
                onChange={handleChange}
                className="w-full mt-2 px-0 py-2 bg-transparent border-b border-white/20 
              focus:border-yellow-400 outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-3 block">
                Payment Method
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* CASH */}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: "cash" })}
                  className={`p-4 rounded-xl border text-left transition 
        ${
          form.paymentMethod === "cash"
            ? "border-yellow-400 bg-yellow-400/10"
            : "border-white/10 bg-white/5 hover:bg-white/10"
        }`}
                >
                  <p className="text-sm font-medium">Cash</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Pay when you receive your order
                  </p>
                </button>

                {/* CARD */}
                <button
                  type="button"
                  disabled
                  className="p-4 rounded-xl border text-left transition 
  border-white/10 bg-white/5 opacity-50 cursor-not-allowed relative"
                >
                  <p className="text-sm font-medium">Card</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Secure online payment
                  </p>
                  <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-yellow-400 text-black font-semibold">
                    Soon
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 🛒 RIGHT — FLOATING SUMMARY CARD */}
        <div className="relative">
          <div className="sticky top-24 bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            {/* ITEMS */}
            <div className="space-y-4 max-h-[260px] overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-300">
                    {item.name} × {item.quantity}
                  </span>

                  <span>{(item.price * item.quantity).toFixed(2)} MAD</span>
                </div>
              ))}
            </div>

            {/* DIVIDER */}
            <div className="my-6 border-t border-white/10" />

            {/* TOTAL */}
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{getTotalPrice().toFixed(2)} MAD</span>
            </div>

            {/* CTA */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-6 w-full py-3 rounded-lg bg-white text-black font-medium
            hover:opacity-90 transition"
            >
              {loading ? "Processing..." : "Confirm"}
            </button>

            {/* TRUST TEXT */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Secure checkout • No hidden fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
