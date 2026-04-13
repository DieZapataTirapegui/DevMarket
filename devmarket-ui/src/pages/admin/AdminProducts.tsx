import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Search, ShieldAlert, PackageX } from "lucide-react";
import { getProducts, deleteProduct } from "../../services/product.service";
import { useAuthStore } from "../../store/authStore";
import { useLang } from "../../context/LangContext";
import ProductModal from "../../components/admin/ProductModal";
import type { Product } from "../../types/product.types";
import { Link } from "react-router-dom";

export default function AdminProducts() {
  const { user } = useAuthStore();
  const { t } = useLang();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: products = [], isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
    onSettled: () => setDeletingId(null),
  });

  const handleDelete = (id: number) => {
    if (!confirm(t.admin.deleteConfirm)) return;
    setDeletingId(id);
    deleteMutation.mutate(id);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (user?.role !== "ADMIN") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4 px-4">
        <ShieldAlert size={48} className="text-red-400" />
        <div className="text-center">
          <h2 className="text-white text-xl font-bold">{t.admin.accessDenied}</h2>
          <p className="text-slate-400 text-sm mt-1">{t.admin.accessDeniedDesc}</p>
        </div>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
          {t.admin.backHome}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
              {t.admin.badge}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{t.admin.title}</h1>
          <p className="text-slate-400 text-sm mt-1">
            {isLoading ? t.products.loading : `${filtered.length} ${t.admin.of} ${products.length} ${t.admin.subtitle}`}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-colors text-sm"
        >
          <Plus size={16} />
          {t.admin.newProduct}
        </button>
      </motion.div>

      {/* Buscador */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder={t.admin.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-800/60 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all"
        />
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-800/40 rounded-2xl h-16 animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <PackageX size={40} className="text-slate-600" />
          <p className="text-slate-400 text-sm">{t.admin.errorMsg}</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-slate-700/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="col-span-1">{t.admin.colImg}</div>
            <div className="col-span-4">{t.admin.colTitle}</div>
            <div className="col-span-2">{t.admin.colCategory}</div>
            <div className="col-span-2">{t.admin.colPrice}</div>
            <div className="col-span-2">{t.admin.colExternalId}</div>
            <div className="col-span-1 text-right">{t.admin.colActions}</div>
          </div>

          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <PackageX size={32} className="text-slate-600" />
                <p className="text-slate-500 text-sm">{t.admin.noResults}</p>
              </div>
            ) : (
              filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-12 gap-4 px-5 py-3.5 border-b border-slate-700/30 last:border-0 hover:bg-slate-700/20 transition-colors items-center"
                >
                  <div className="col-span-1">
                    <div className="w-10 h-10 bg-slate-900/60 rounded-lg flex items-center justify-center p-1">
                      <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain" />
                    </div>
                  </div>
                  <div className="col-span-4">
                    <p className="text-white text-sm font-medium line-clamp-1">{product.title}</p>
                    <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">{product.description}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full capitalize">
                      {product.category}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-white font-semibold text-sm">${Number(product.price).toFixed(2)}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 text-sm font-mono">{product.externalId ?? "—"}</span>
                  </div>
                  <div className="col-span-1 flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                      title={t.admin.btnEdit}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      {deletingId === product.id
                        ? <Loader2 size={14} className="animate-spin" />
                        : <Trash2 size={14} />}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}

      <ProductModal
        open={modalOpen}
        product={editingProduct}
        onClose={() => setModalOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["products"] })}
      />
    </div>
  );
}