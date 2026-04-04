import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Package,
  ClipboardList,
  LogIn,
  LogOut,
  Home,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { logout } from "../services/auth.service";
import { useLang } from "../context/LangContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, t, toggleLang } = useLang();

  const navLinks = [
    { to: "/", label: t.nav.home, icon: Home },
    { to: "/products", label: t.nav.products, icon: Package },
    { to: "/cart", label: t.nav.cart, icon: ShoppingCart, authRequired: true },
    { to: "/orders", label: t.nav.orders, icon: ClipboardList, authRequired: true },
  ];

  const handleLogout = () => {
    logout();
    clearAuth();
    navigate("/");
    setMenuOpen(false);
  };

  const visibleLinks = navLinks.filter(
    (link) => !link.authRequired || isAuthenticated
  );

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
            {visibleLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    color: isActive ? "rgb(165 180 252)" : "rgb(148 163 184)",
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-indigo-500/15 rounded-lg border border-indigo-500/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <Icon size={15} />
                  <span className="relative">{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop auth + lang switch */}
          <div className="hidden md:flex items-center gap-3">
            {/* Switch ES/EN */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800/60 hover:bg-slate-700/60 transition-all"
              title="Cambiar idioma"
            >
              <span className="text-xs font-bold text-slate-300 tracking-widest">
                {lang.toUpperCase()}
              </span>
              <motion.div
                animate={{ x: lang === "en" ? 2 : -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-1 h-1 rounded-full bg-indigo-400"
              />
            </button>

            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-400">
                  {user?.email?.split("@")[0]}
                </span>
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
              {visibleLinks.map(({ to, label, icon: Icon }) => {
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
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}

              <div className="pt-2 mt-1 border-t border-slate-700/50">
                {/* Switch idioma mobile */}
                <button
                  onClick={toggleLang}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                >
                  <span className="text-xs font-bold tracking-widest bg-slate-700 px-2 py-0.5 rounded">
                    {lang.toUpperCase()}
                  </span>
                  Cambiar idioma
                </button>

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