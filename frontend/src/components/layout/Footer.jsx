import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

const footerLinks = {
  Shop: [
    { label: "All Products", path: "/products" },
    { label: "Deals", path: "/products?featured=true" },
    { label: "Electronics", path: "/products?category=Electronics" },
    { label: "Fashion", path: "/products?category=Fashion" },
  ],

  Company: [
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Careers", path: "/careers" },
  ],

  Support: [
    { label: "My Orders", path: "/orders" },
    { label: "Wishlist", path: "/wishlist" },
    { label: "Track Order", path: "/orders" },
    { label: "Returns & Refunds", path: "/returns" },
  ],
};

const socials = [
  { icon: "𝕏", url: "https://twitter.com" },
  { icon: "📷", url: "https://instagram.com" },
  { icon: "📘", url: "https://facebook.com" },
  { icon: "💼", url: "https://linkedin.com" },
];

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    toast.success("Subscribed successfully!");
    setEmail("");
  };
  if (location.pathname.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-16 pb-8">
        {/* ================= TOP GRID ================= */}
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1.3fr] gap-10">
          {/* ================= BRAND + NEWSLETTER ================= */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🛍️</span>

              <h1 className="text-xl font-extrabold text-white">
                Shopzy<span className="text-orange-500">.</span>
              </h1>
            </Link>

            <p className="text-sm mt-4 leading-relaxed max-w-xs">
              Smart shopping, powered by AI. Discover trending products and
              enjoy a seamless checkout experience.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="mt-6 max-w-xs">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">
                Get updates & offers
              </p>

              <div className="flex h-11 rounded-xl border border-slate-700 bg-slate-800/60 overflow-hidden focus-within:border-orange-400 transition-colors duration-200">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 min-w-0 px-4 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                />

                <button
                  type="submit"
                  className="px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:brightness-110 transition-all duration-200"
                >
                  Join
                </button>
              </div>
            </form>
          </div>

          {/* ================= LINK COLUMNS ================= */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                {heading}
              </h3>

              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm hover:text-orange-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ================= CONTACT + SOCIALS ================= */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Get in Touch
            </h3>

            <ul className="mt-4 space-y-2.5 text-sm">
              <li>📍 Yamuna Nagar, Haryana, India</li>
              <li>📧 support@shopzy.com</li>
              <li>📞 +91 98765 43210</li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-2 mt-5">
              {socials.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Social media"
                  className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-sm hover:bg-orange-500 hover:text-white hover:-translate-y-0.5 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ================= TRUST STRIP ================= */}
        <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            ["🔒", "Secure Payments"],
            ["🚚", "Fast Delivery"],
            ["↩️", "Easy Returns"],
            ["🤖", "AI Support 24/7"],
          ].map(([icon, label]) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 text-xs text-slate-400"
            >
              <span className="text-xl">{icon}</span>
              {label}
            </div>
          ))}
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Shopzy. All rights reserved.
          </p>

          <div className="flex gap-5 text-xs text-slate-500">
            <Link
              to="/privacy"
              className="hover:text-orange-400 transition-colors"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="hover:text-orange-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
