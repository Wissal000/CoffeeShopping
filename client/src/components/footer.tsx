import { FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative mt-20 text-white overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[#0f0a08]" />

      {/* Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[400px] h-[400px] bg-yellow-400/10 rounded-full blur-3xl top-[-120px] left-[-120px]" />
        <div className="absolute w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-3xl bottom-[-120px] right-[-120px]" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-yellow-400">
            Java House
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Crafting the perfect coffee experience with passion, quality beans,
            and cozy vibes.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-yellow-400 cursor-pointer transition">Home</li>
            <li className="hover:text-yellow-400 cursor-pointer transition">Menu</li>
            <li className="hover:text-yellow-400 cursor-pointer transition">Contact</li>
          </ul>
        </div>

        {/* Contact / Address */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Contact</h3>

          <div className="flex items-start gap-3 text-gray-400 text-sm">
            <FaMapMarkerAlt className="text-yellow-400 mt-1" />
            <span>Dakhla, Morocco</span>
          </div>

          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <FaPhoneAlt className="text-yellow-400" />
            <span>+212 6 00 00 00 00</span>
          </div>

          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <FaEnvelope className="text-yellow-400" />
            <span>JavaContact@email.com</span>
          </div>
        </div>

        {/* Social */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Follow Us</h3>

          <div className="flex gap-4">
            {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
              <div
                key={i}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-yellow-400 hover:text-black cursor-pointer transition"
              >
                <Icon size={16} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-gray-500 text-sm py-6 border-t border-white/10">
        © 2026 Java Shop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;