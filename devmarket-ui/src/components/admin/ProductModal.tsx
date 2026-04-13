import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, AlertCircle } from "lucide-react";
import { createProduct, updateProduct, type CreateProductData } from "../../services/product.service";
import { useLang } from "../../context/LangContext";
import type { Product } from "../../types/product.types";

interface Props {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const emptyForm: CreateProductData = {
  externalId: 0, title: "", description: "", price: 0, image: "", category: "",
};

export default function ProductModal({ open, product, onClose, onSuccess }: Props) {
  const { t } = useLang();
  const [form, setForm] = useState<CreateProductData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setForm({
        externalId: product.externalId ?? 0,
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    } else {
      setForm(emptyForm);
    }
    setError(null);
  }, [product, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "externalId" ? Number(value) : value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category.trim()) {
      setError(t.admin.errorRequired);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await updateProduct(product!.id, form);
      } else {
        await createProduct(form);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })
        ?.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : (msg ?? t.admin.errorSave));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-900/60 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-800 border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50">
                <h2 className="text-white font-bold text-lg">
                  {isEditing ? t.admin.modalEdit : t.admin.modalCreate}
                </h2>
                <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                {error && (
                  <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <AlertCircle size={15} className="text-red-400 mt-0.5 shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-300">{t.admin.fieldTitle} <span className="text-red-400">*</span></label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder={t.admin.placeholderTitle} required className={inputClass} />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-300">{t.admin.fieldDesc}</label>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder={t.admin.placeholderDesc} rows={3} className={`${inputClass} resize-none`} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">{t.admin.fieldPrice} <span className="text-red-400">*</span></label>
                    <input type="number" name="price" value={form.price} onChange={handleChange} placeholder={t.admin.placeholderPrice} min={0} step="0.01" required className={inputClass} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">{t.admin.fieldCategory} <span className="text-red-400">*</span></label>
                    <input name="category" value={form.category} onChange={handleChange} placeholder={t.admin.placeholderCategory} required className={inputClass} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-300">{t.admin.fieldImage}</label>
                  <input name="image" value={form.image} onChange={handleChange} placeholder={t.admin.placeholderImage} className={inputClass} />
                  {form.image && (
                    <div className="mt-2 w-16 h-16 bg-slate-900/60 rounded-xl flex items-center justify-center p-2 border border-slate-700">
                      <img src={form.image} alt="preview" className="max-h-full max-w-full object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-300">
                    {t.admin.fieldExternalId}
                    <span className="text-slate-500 text-xs ml-2">({t.admin.fieldExternalIdHint})</span>
                  </label>
                  <input type="number" name="externalId" value={form.externalId} onChange={handleChange} min={0} className={inputClass} />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-300 border border-slate-700 hover:bg-slate-700/60 transition-colors">
                    {t.admin.btnCancel}
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed text-white shadow-lg shadow-indigo-500/20 transition-colors">
                    {loading ? (
                      <><Loader2 size={14} className="animate-spin" />{isEditing ? t.admin.btnSaving : t.admin.btnCreating}</>
                    ) : (
                      isEditing ? t.admin.btnEdit : t.admin.btnCreate
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}