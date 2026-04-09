import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Zap, ShieldCheck, Truck, ArrowRight, Star } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useLang } from "../context/LangContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const { t } = useLang();

  const features = [
    { icon: Zap,         title: t.home.feature1Title, desc: t.home.feature1Desc, color: "text-amber-400",   bg: "bg-amber-400/10 border-amber-400/20" },
    { icon: ShieldCheck, title: t.home.feature2Title, desc: t.home.feature2Desc, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
    { icon: Truck,       title: t.home.feature3Title, desc: t.home.feature3Desc, color: "text-indigo-400",  bg: "bg-indigo-400/10 border-indigo-400/20" },
  ];

  const categories = [
    { name: t.home.cat1, emoji: "💻", count: t.home.catCount1, filter: "electronics" },
    { name: t.home.cat2, emoji: "👔", count: t.home.catCount2, filter: "men's clothing" },
    { name: t.home.cat3, emoji: "💍", count: t.home.catCount3, filter: "jewelery" },
    { name: t.home.cat4, emoji: "👗", count: t.home.catCount4, filter: "women's clothing" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-32 pb-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6"
        >
          <Star size={12} className="text-indigo-400 fill-indigo-400" />
          <span className="text-indigo-300 text-xs font-medium tracking-wide">
            {t.home.badge}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight max-w-4xl"
        >
          {t.home.title1}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
            {t.home.titleHighlight}
          </span>
          {t.home.title2}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-400 text-lg sm:text-xl mt-6 max-w-xl leading-relaxed"
        >
          {t.home.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3 mt-10"
        >
          <Link
            to="/products"
            className="group flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200"
          >
            <ShoppingBag size={18} />
            {t.home.cta}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {!isAuthenticated && (
            <Link
              to="/register"
              className="flex items-center gap-2 text-slate-300 hover:text-white font-medium px-8 py-3.5 rounded-xl border border-slate-700 hover:border-slate-600 hover:bg-slate-800/60 transition-all duration-200"
            >
              {t.home.ctaRegister}
            </Link>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center gap-8 mt-14 text-center"
        >
          {[
            { value: "20+", label: t.home.statsProducts },
            { value: "4",   label: t.home.statsCategories },
            { value: "100%",label: t.home.statsSafe },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-0.5">
              <span className="text-2xl font-bold text-white">{s.value}</span>
              <span className="text-slate-500 text-xs">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className={`flex flex-col gap-4 p-6 rounded-2xl border ${f.bg} backdrop-blur-sm`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.bg} border`}>
                <f.icon size={20} className={f.color} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{f.title}</h3>
                <p className="text-slate-400 text-sm mt-1">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CATEGORÍAS ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="text-xl font-bold text-white">{t.home.categoriesTitle}</h2>
            <p className="text-slate-500 text-sm mt-0.5">{t.home.categoriesSubtitle}</p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors group"
          >
            {t.home.categoriesViewAll}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.filter} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <Link
                to={`/products?category=${encodeURIComponent(cat.filter)}`}
                className="group flex flex-col items-center gap-3 p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/30 rounded-2xl transition-all duration-300 text-center"
              >
                <span className="text-4xl">{cat.emoji}</span>
                <div>
                  <p className="text-white text-sm font-medium group-hover:text-indigo-300 transition-colors">{cat.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{cat.count}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      {!isAuthenticated && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent border border-indigo-500/20 rounded-3xl p-10 text-center"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl font-black text-white mb-3">{t.home.ctaFinalTitle}</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">{t.home.ctaFinalDesc}</p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200"
            >
              {t.home.ctaFinalBtn}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </section>
      )}
    </div>
  );
}