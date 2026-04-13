import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Package, ClipboardList,
  LogIn, LogOut, Home, Menu, X, ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { logout } from "../services/auth.service";
import { getCart } from "../services/cart.service";
import { useLang } from "../context/LangContext";

// SVG oficial de Google Translate
const GoogleTranslateIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    color="white"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
      fill="currentColor"
    />
  </svg>
);

const langLabels: Record<string, string> = {
  es: "ES",
  en: "EN",
  ja: "日本語",
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, t, toggleLang } = useLang();

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuthenticated,
    retry: false,
    staleTime: 30_000,
  });
  const cartCount = cart?.totalItems ?? 0;

  const navLinks = [
    { to: "/", label: t.nav.home, icon: Home },
    { to: "/products", label: t.nav.products, icon: Package },
    { to: "/cart", label: t.nav.cart, icon: ShoppingCart, authRequired: true, badge: cartCount },
    { to: "/orders", label: t.nav.orders, icon: ClipboardList, authRequired: true },
  ];

  const handleLogout = () => {
    logout();
    clearAuth();
    navigate("/");
    setMenuOpen(false);
  };

  const visibleLinks = navLinks.filter((link) => !link.authRequired || isAuthenticated);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50" />

      <nav className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:bg-indigo-400 transition-colors">
              <Package size={16} className="text-white" />
            </div>
            <span className="font-bold text-white tracking-tight text-lg">
              dev<span className="text-indigo-400">market</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {visibleLinks.map(({ to, label, icon: Icon, badge }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: isActive ? "rgb(165 180 252)" : "rgb(148 163 184)" }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-indigo-500/15 rounded-lg border border-indigo-500/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative">
                    <Icon size={15} />
                    {badge != null && badge > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none"
                      >
                        {badge > 9 ? "9+" : badge}
                      </motion.span>
                    )}
                  </span>
                  <span className="relative">{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop: toggles + auth */}
          <div className="hidden md:flex items-center gap-2">

            {/* Toggle idioma con ícono Google Translate */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-indigo-500/50 bg-slate-800/60 hover:bg-indigo-500/10 transition-all group"
              title="Cambiar idioma"
            >
              <GoogleTranslateIcon size={15} />
              <span className="text-xs font-bold text-slate-300 group-hover:text-indigo-300 tracking-wider transition-colors">
                {langLabels[lang]}
              </span>
            </button>

            {/* Link Admin */}
            {isAuthenticated && user?.role === "ADMIN" && (
              <Link
                to="/admin/products"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 transition-all"
              >
                <ShieldCheck size={14} />
                Admin
              </Link>
            )}

            {/* Auth */}
            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-400 ml-1">{user?.email?.split("@")[0]}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
                >
                  <LogOut size={15} />
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
                >
                  <LogIn size={15} />
                  {t.nav.login}
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-500 hover:bg-indigo-400 text-white shadow-md shadow-indigo-500/20 transition-colors"
                >
                  {t.nav.register}
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="relative md:hidden bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50"
          >
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
              {visibleLinks.map(({ to, label, icon: Icon, badge }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    }`}
                  >
                    <span className="relative">
                      <Icon size={16} />
                      {badge != null && badge > 0 && (
                        <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {badge > 9 ? "9+" : badge}
                        </span>
                      )}
                    </span>
                    {label}
                  </Link>
                );
              })}

              <div className="pt-2 mt-1 border-t border-slate-700/50 flex flex-col gap-1">
                {/* Toggle idioma mobile */}
                <button
                  onClick={toggleLang}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                >
                  <GoogleTranslateIcon size={16} />
                  <span>{langLabels[lang]} — {t.nav.changeLang}</span>
                </button>

                {/* Admin mobile */}
                {isAuthenticated && user?.role === "ADMIN" && (
                  <Link
                    to="/admin/products"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-indigo-300 hover:bg-indigo-500/10 border border-indigo-500/20 transition-colors"
                  >
                    <ShieldCheck size={16} />
                    Admin
                  </Link>
                )}

                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                  >
                    <LogOut size={16} />
                    {t.nav.logout} ({user?.email?.split("@")[0]})
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                    >
                      <LogIn size={16} />
                      {t.nav.login}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-indigo-500 hover:bg-indigo-400 text-white transition-colors"
                    >
                      {t.nav.register}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}