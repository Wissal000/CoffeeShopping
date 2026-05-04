import { motion } from "framer-motion";
import { Coffee, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import { useCart } from "../context/CartContext";

const Landing = () => {
  const navigate = useNavigate();
  const { cart } = useCart();

  const totalItems = cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <div className="relative min-h-screen bg-[#0b0b0c] text-white overflow-hidden">
      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 z-0">
        <img
          src="/background.jpg"
          alt="drinks"
          className="w-full h-full object-cover opacity-30 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
      </div>

      <div className="relative z-10">
        {/* ===== NAVBAR ===== */}
        <nav className="flex justify-between items-center px-6 md:px-12 py-6">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <Coffee className="text-yellow-400" />
            Java House
          </div>

          <div className="flex items-center gap-6 text-sm">
            <button
              onClick={() => navigate("/products")}
              className="text-gray-400 hover:text-white transition"
            >
              Menu
            </button>

            <button className="text-gray-400 hover:text-white transition">
              About
            </button>

            {/* CART */}
            <div
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer"
            >
              <ShoppingCart className="text-gray-400 hover:text-white transition" />

              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-[2px] rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
          </div>
        </nav>

        {/* ===== HERO ===== */}
        <section className="flex flex-col items-center text-center px-6 pt-28 pb-24">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold leading-tight tracking-tight max-w-3xl"
          >
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Refresh Your Day
            </span>
            <br />
            Drinks for Every Mood
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-6 max-w-lg text-base leading-relaxed"
          >
            Hot coffees, refreshing cold drinks, and sweet desserts — everything
            you need in one place.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate("/products")}
            className="mt-8 px-6 py-3 rounded-full 
            bg-yellow-400 text-black font-medium 
            hover:bg-yellow-300 
            transition"
          >
            Explore Menu
          </motion.button>
        </section>

        {/* ===== FEATURES===== */}
        <section className="max-w-5xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-10 text-center">
          {[
            {
              title: "Hot & Cold",
              desc: "Drinks for every season",
            },
            {
              title: "Fresh",
              desc: "Quality ingredients only",
            },
            {
              title: "Fast",
              desc: "Quick & easy ordering",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="space-y-2"
            >
              <h3 className="text-yellow-400 font-medium">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </section>

        <section className="text-center pb-20 px-6">
          <h2 className="text-2xl font-semibold mb-3">
            Find your next favorite drink
          </h2>

          <p className="text-gray-400 text-sm">
            Browse our menu and discover something delicious.
          </p>
        </section>

        {/* ===== FOOTER ===== */}
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
