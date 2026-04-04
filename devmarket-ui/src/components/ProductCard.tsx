import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { addToCart } from "../services/cart.service";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/product.types";

interface Props {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: Props) {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // no navegar al detalle
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setStatus("loading");
    try {
      await addToCart(product.id, 1);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("idle");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
    >
      <Link
        to={`/products/${product.id}`}
        className="group flex flex-col bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-slate-900/40 h-full"
      >
        {/* Imagen */}
        <div className="relative bg-slate-900/60 flex items-center justify-center p-6 h-52 overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          {/* Badge categoría */}
          <span className="absolute top-3 left-3 bg-slate-800/90 backdrop-blur-sm text-indigo-400 text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-700/60 capitalize">
            {product.category}
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2 group-hover:text-indigo-200 transition-colors">
            {product.title}
          </h3>

          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 flex-1">
            {product.description}
          </p>

          {/* Precio + botón */}
          <div className="flex items-center justify-between pt-1 mt-auto">
            <span className="text-2xl font-bold text-white">
              ${product.price.toFixed(2)}
            </span>

            <button
              onClick={handleAddToCart}
              disabled={status === "loading" || status === "done"}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-md ${
                status === "done"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/20 hover:shadow-indigo-500/30"
              } disabled:cursor-not-allowed`}
            >
              {status === "loading" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : status === "done" ? (
                <>
                  <Check size={14} />
                  Agregado
                </>
              ) : (
                <>
                  <ShoppingCart size={14} />
                  Agregar
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}