import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, ChevronDown, ShoppingBag, Package } from "lucide-react";
import { useState } from "react";
import { getOrders } from "../services/order.service";
import { useAuthStore } from "../store/authStore";
import { useLang } from "../context/LangContext";

interface OrderProduct {
  id: number;
  title: string;
  image: string;
  price: number;
  category: string;
}

interface OrderItem {
  id: number;
  product: OrderProduct;
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  id: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export default function Orders() {
  const { isAuthenticated } = useAuthStore();
  const { t } = useLang();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: orders = [], isLoading, isError } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: isAuthenticated,
    retry: false,
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // No autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-5 px-4">
        <ClipboardList size={48} className="text-slate-600" />
        <div className="text-center">
          <h2 className="text-white text-xl font-bold">{t.orders.loginTitle}</h2>
          <p className="text-slate-400 text-sm mt-1">{t.orders.loginDesc}</p>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          {t.orders.login}
        </Link>
      </div>
    );
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-8 w-40 bg-slate-800 rounded-lg animate-pulse mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800/40 rounded-2xl h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4 px-4">
        <ClipboardList size={48} className="text-slate-600" />
        <p className="text-slate-400 text-sm">{t.orders.errorMsg}</p>
      </div>
    );
  }

  // Sin pedidos
  if (orders.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-5 px-4">
        <ClipboardList size={48} className="text-slate-600" />
        <div className="text-center">
          <h2 className="text-white text-xl font-bold">{t.orders.emptyTitle}</h2>
          <p className="text-slate-400 text-sm mt-1">{t.orders.emptyDesc}</p>
        </div>
        <Link
          to="/products"
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          <ShoppingBag size={16} />
          {t.orders.browseProducts}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white tracking-tight">{t.orders.title}</h1>
        <p className="text-slate-400 text-sm mt-1">
          {orders.length} {orders.length === 1 ? t.orders.order : t.orders.orders}
        </p>
      </motion.div>

      {/* Lista de órdenes */}
      <div className="space-y-4">
        {orders.map((order, i) => {
          const isExpanded = expandedId === order.id;
          const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/60 transition-colors"
            >
              {/* Cabecera del pedido */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  {/* Ícono */}
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <Package size={16} className="text-indigo-400" />
                  </div>
                  {/* Info */}
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {t.orders.orderNum} #{order.id}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-white font-bold">${Number(order.total).toFixed(2)}</p>
                    <p className="text-slate-500 text-xs">
                      {totalItems} {totalItems === 1 ? t.orders.item : t.orders.items}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} className="text-slate-500" />
                  </motion.div>
                </div>
              </button>

              {/* Detalle del pedido */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-slate-700/50 px-5 py-4 space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          {/* Imagen */}
                          <Link to={`/products/${item.product.id}`} className="shrink-0">
                            <div className="w-12 h-12 bg-slate-900/60 rounded-xl flex items-center justify-center p-1.5">
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          </Link>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/products/${item.product.id}`}
                              className="text-white text-xs font-medium line-clamp-1 hover:text-indigo-300 transition-colors"
                            >
                              {item.product.title}
                            </Link>
                            <p className="text-slate-500 text-xs capitalize mt-0.5">
                              {item.product.category}
                            </p>
                          </div>
                          {/* Precio */}
                          <div className="text-right shrink-0">
                            <p className="text-white text-xs font-bold">
                              ${(Number(item.priceAtPurchase) * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-slate-500 text-xs">
                              x{item.quantity} · ${Number(item.priceAtPurchase).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Total del pedido */}
                      <div className="flex justify-between items-center pt-3 border-t border-slate-700/50 mt-2">
                        <span className="text-slate-400 text-sm">{t.orders.total}</span>
                        <span className="text-white font-black text-lg">${Number(order.total).toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}