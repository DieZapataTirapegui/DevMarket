import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Check,
  Loader2,
  ArrowLeft,
  Tag,
  PackageX,
} from "lucide-react";
import { getProduct } from "../services/product.service";
import { addToCart } from "../services/cart.service";
import { useAuthStore } from "../store/authStore";
import type { Product } from "../types/product.types";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getProduct(Number(id)),
    enabled: !!id,
  });

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setStatus("loading");
    try {
      await addToCart(product!.id, quantity);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("idle");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-slate-800/40 rounded-2xl h-96 animate-pulse" />
          <div className="space-y-4">
            {[80, 60, 40, 40, 60].map((w, i) => (
              <div
                key={i}
                className="bg-slate-800/40 rounded-lg animate-pulse h-5"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <PackageX size={40} className="text-slate-600" />
        <p className="text-slate-400 text-sm">Producto no encontrado.</p>
        <Link
          to="/products"
          className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
        >
          Volver a productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors group"
        >
          <ArrowLeft
            size={15}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Volver
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Imagen */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl flex items-center justify-center p-10 min-h-80"
        >
          <img
            src={product.image}
            alt={product.title}
            className="max-h-72 max-w-full object-contain"
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col gap-5"
        >
          {/* Categoría */}
          <div className="flex items-center gap-2">
            <Tag size={13} className="text-indigo-400" />
            <span className="text-indigo-400 text-sm font-medium capitalize">
              {product.category}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            {product.title}
          </h1>

          {/* Precio */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-slate-500 text-sm">USD</span>
          </div>

          {/* Descripción */}
          <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-700/50 pt-5">
            {product.description}
          </p>

          {/* Cantidad + agregar */}
          <div className="flex items-center gap-3 pt-2">
            {/* Selector de cantidad */}
            <div className="flex items-center border border-slate-700 rounded-xl overflow-hidden bg-slate-800/60">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors text-lg leading-none"
              >
                −
              </button>
              <span className="px-4 py-3 text-white font-medium text-sm min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors text-lg leading-none"
              >
                +
              </button>
            </div>

            {/* Botón agregar */}
            <button
              onClick={handleAddToCart}
              disabled={status === "loading" || status === "done"}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg ${
                status === "done"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/20"
              } disabled:cursor-not-allowed`}
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Agregando...
                </>
              ) : status === "done" ? (
                <>
                  <Check size={15} />
                  ¡Agregado al carrito!
                </>
              ) : (
                <>
                  <ShoppingCart size={15} />
                  Agregar al carrito
                </>
              )}
            </button>
          </div>

          {!isAuthenticated && (
            <p className="text-slate-500 text-xs">
              Necesitás{" "}
              <Link
                to="/login"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                iniciar sesión
              </Link>{" "}
              para agregar al carrito.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}