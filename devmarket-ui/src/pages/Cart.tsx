import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Trash2, ArrowRight, ShoppingBag,
  Loader2, CheckCircle2, PackageX,
} from "lucide-react";
import { getCart, removeFromCart, checkout } from "../services/cart.service";
import { useAuthStore } from "../store/authStore";
import { useLang } from "../context/LangContext";

interface CartProduct {
  id: number;
  title: string;
  image: string;
  price: number;
  category: string;
}

interface CartItem {
  id: number;
  product: CartProduct;
  quantity: number;
  subtotal: number;
}

interface Cart {
  id: number;
  items: CartItem[];
  totalItems: number;
  total: number;
}

export default function Cart() {
  const { isAuthenticated } = useAuthStore();
  const { t } = useLang();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "loading" | "done">("idle");

  const { data: cart, isLoading, isError } = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuthenticated,
    retry: false,
  });

  const removeMutation = useMutation({
    mutationFn: (productId: number) => removeFromCart(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const handleCheckout = async () => {
    setCheckoutStatus("loading");
    try {
      await checkout();
      setCheckoutStatus("done");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setTimeout(() => {
        setCheckoutStatus("idle");
        navigate("/orders");
      }, 2000);
    } catch {
      setCheckoutStatus("idle");
    }
  };

  // No autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-5 px-4">
        <ShoppingCart size={48} className="text-slate-600" />
        <div className="text-center">
          <h2 className="text-white text-xl font-bold">{t.cart.loginTitle}</h2>
          <p className="text-slate-400 text-sm mt-1">{t.cart.loginDesc}</p>
        </div>
        <Link to="/login" className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium px-6 py-3 rounded-xl transition-colors">
          {t.cart.login}
        </Link>
      </div>
    );
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-8 w-40 bg-slate-800 rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="bg-slate-800/40 rounded-2xl h-28 animate-pulse" />)}
          </div>
          <div className="bg-slate-800/40 rounded-2xl h-56 animate-pulse" />
        </div>
      </div>
    );
  }

  // Carrito vacío o error
  if (isError || !cart || cart.items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-5 px-4">
        <PackageX size={48} className="text-slate-600" />
        <div className="text-center">
          <h2 className="text-white text-xl font-bold">{t.cart.emptyTitle}</h2>
          <p className="text-slate-400 text-sm mt-1">{t.cart.emptyDesc}</p>
        </div>
        <Link to="/products" className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium px-6 py-3 rounded-xl transition-colors">
          <ShoppingBag size={16} />
          {t.cart.viewProducts}
        </Link>
      </div>
    );
  }

  // Checkout completado
  if (checkoutStatus === "done") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-5 px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.4 }}>
          <CheckCircle2 size={64} className="text-emerald-400" />
        </motion.div>
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold">{t.cart.successTitle}</h2>
          <p className="text-slate-400 text-sm mt-1">{t.cart.successDesc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">{t.cart.title}</h1>
        <p className="text-slate-400 text-sm mt-1">
          {cart.totalItems} {cart.totalItems === 1 ? t.cart.product : t.cart.products}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.25 }}
                className="flex gap-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 hover:border-slate-600/60 transition-colors"
              >
                <Link to={`/products/${item.product.id}`} className="shrink-0">
                  <div className="w-20 h-20 bg-slate-900/60 rounded-xl flex items-center justify-center p-2">
                    <img src={item.product.image} alt={item.product.title} className="max-h-full max-w-full object-contain" />
                  </div>
                </Link>

                <div className="flex flex-col flex-1 min-w-0 gap-1">
                  <Link to={`/products/${item.product.id}`} className="text-white text-sm font-semibold leading-snug line-clamp-2 hover:text-indigo-300 transition-colors">
                    {item.product.title}
                  </Link>
                  <span className="text-slate-500 text-xs capitalize">{item.product.category}</span>
                  <div className="flex items-center justify-between mt-auto pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs">x{item.quantity}</span>
                      <span className="text-white font-bold">${item.subtotal.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => removeMutation.mutate(item.product.id)}
                      disabled={removeMutation.isPending}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-red-400 text-xs transition-colors disabled:opacity-50"
                    >
                      {removeMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      {t.cart.remove}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Resumen */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 h-fit sticky top-24"
        >
          <h2 className="text-white font-bold text-lg mb-5">{t.cart.summary}</h2>

          <div className="space-y-3 text-sm">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-slate-400">
                <span className="truncate max-w-[160px]">{item.product.title.split(" ").slice(0, 3).join(" ")}...</span>
                <span className="shrink-0 ml-2">${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-700/50 mt-5 pt-5">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-300 font-medium">{t.cart.total}</span>
              <span className="text-white font-black text-2xl">${cart.total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutStatus === "loading"}
              className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
            >
              {checkoutStatus === "loading"
                ? <><Loader2 size={16} className="animate-spin" />{t.cart.processing}</>
                : <>{t.cart.checkout} <ArrowRight size={16} /></>}
            </button>

            <Link to="/products" className="flex items-center justify-center gap-2 text-slate-400 hover:text-white text-sm mt-4 transition-colors">
              {t.cart.keepShopping}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}