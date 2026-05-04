import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const Cart = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty, getTotalPrice } =
    useCart();

  const navigate = useNavigate();
  const total = getTotalPrice();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* ===== HEADER ===== */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold tracking-tight">Cart</h1>
          <p className="text-gray-500 text-sm mt-1">
            Review your items before checkout
          </p>
        </div>

        {/* ===== EMPTY STATE ===== */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/5 border border-white/10 mb-6">
              <ShoppingCart className="w-6 h-6 text-gray-400" />
            </div>

            <h2 className="text-xl font-medium mb-2">Nothing here yet</h2>

            <p className="text-gray-500 text-sm mb-6 max-w-sm">
              Looks like you haven’t added anything to your cart.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="px-5 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:opacity-90 transition"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {/* ===== LEFT: ITEMS ===== */}
            <div className="md:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />

                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.price} MAD</p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-4">
                    {/* QUANTITY */}
                    <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-md">
                      <button
                        onClick={() => decreaseQty(item.productId)}
                        className="px-2 text-gray-400 hover:text-white"
                      >
                        −
                      </button>

                      <span className="text-sm">{item.quantity}</span>

                      <button
                        onClick={() => increaseQty(item.productId)}
                        className="px-2 text-gray-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    {/* PRICE */}
                    <p className="text-sm font-medium text-white">
                      {(item.price * item.quantity).toFixed(2)} MAD
                    </p>

                    {/* REMOVE */}
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-gray-500 hover:text-red-400 transition"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ===== RIGHT: SUMMARY ===== */}
            <div className="h-fit sticky top-20 p-6 rounded-xl bg-white/[0.03] border border-white/10">
              <h2 className="text-lg font-medium mb-6">Summary</h2>

              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{total.toFixed(2)} MAD</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>

                <div className="border-t border-white/10 pt-3 flex justify-between text-white font-medium">
                  <span>Total</span>
                  <span>{total.toFixed(2)} MAD</span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => navigate("/products")}
                  className="w-full py-2 rounded-lg border border-white/10 hover:border-white/20 text-sm transition"
                >
                  Continue shopping
                </button>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-2 rounded-lg bg-white text-black text-sm font-medium hover:opacity-90 transition"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
