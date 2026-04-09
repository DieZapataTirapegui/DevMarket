import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, PackageX } from "lucide-react";
import { getProducts } from "../services/product.service";
import ProductCard from "../components/ProductCard";
import { useLang } from "../context/LangContext";
import type { Product } from "../types/product.types";

export default function Products() {
  const { t } = useLang();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") ?? "all"
  );
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  // Sincronizar categoría si cambia el query param (desde Home)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const { data: products = [], isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))];
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== "all") result = result.filter((p) => p.category === selectedCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, search, selectedCategory, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">{t.products.title}</h1>
        <p className="text-slate-400 text-sm mt-1">
          {isLoading
            ? t.products.loading
            : `${filtered.length} ${filtered.length !== 1 ? t.products.foundPlural : t.products.found}`}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }} className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={t.products.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/60 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all"
          />
        </div>

        <div className="relative">
          <SlidersHorizontal size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none bg-slate-800/60 border border-slate-700 focus:border-indigo-500 rounded-xl pl-10 pr-8 py-2.5 text-sm text-slate-300 outline-none transition-all cursor-pointer capitalize min-w-[160px]"
          >
            <option value="all">{t.products.allCategories}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="capitalize">{cat}</option>
            ))}
          </select>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "default" | "price-asc" | "price-desc")}
          className="appearance-none bg-slate-800/60 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none transition-all cursor-pointer min-w-[160px]"
        >
          <option value="default">{t.products.sortBy}</option>
          <option value="price-asc">{t.products.sortAsc}</option>
          <option value="price-desc">{t.products.sortDesc}</option>
        </select>
      </motion.div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-slate-800/40 border border-slate-700/30 rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <PackageX size={40} className="text-slate-600" />
          <p className="text-slate-400 text-sm">{t.products.errorMsg}</p>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <PackageX size={40} className="text-slate-600" />
          <p className="text-slate-400 text-sm">{t.products.emptyMsg}</p>
          <button
            onClick={() => { setSearch(""); setSelectedCategory("all"); }}
            className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
          >
            {t.products.clearFilters}
          </button>
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}